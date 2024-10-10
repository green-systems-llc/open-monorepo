import { uuid } from '../crypto/uuid.function';
import { KeyValue } from '../object/key-value';
import { sort } from '../sort/sort.function';
import { removeItem } from '../array/remove-item.function';
import { toArray } from '../array/to-array.function';
import { FieldSortInfo } from '../sort/field-sort-info';
import { isObject } from '../type-check/is-object.function';
import { PrimaryFieldType, Repository } from './repository';
import { isString } from '../type-check/is-string.function';
import { valuesMatch } from '../array/values-match.function';
import { isNotValue } from '../type-check/is-not-value.function';
import { anyNonValues } from '../type-check/any-non-values.function';
import {
  FindCriteria,
  AnyFindCriteria,
  FindAllCriteria,
} from './find-criteria';

export class InMemoryRepository<
  TPrimaryField extends PrimaryFieldType = string,
  TRecord = KeyValue
> implements Repository<TPrimaryField, TRecord>
{
  private readonly isSingleField: boolean;

  constructor(
    readonly items: TRecord[] = [],
    readonly idField: string | string[] = 'id'
  ) {
    this.ensureIdValues();
    this.isSingleField = isString(this.idField);
  }

  findAll(criteria?: FindAllCriteria): Promise<TRecord[]> {
    const items = [...this.items];
    if (criteria?.orderBy) {
      sort(items, ...criteria.orderBy);
    }

    return Promise.resolve(items);
  }

  find(criteria: FindCriteria): Promise<TRecord[]> {
    const filter = criteria as AnyFindCriteria;
    const hasPaging = criteria.page && criteria.size;
    const hasSorting = Boolean(criteria.orderBy);
    const items = filter.search ? this.search(filter.search) : [...this.items];

    if (filter.query) {
      throw new Error(`Find by query is not supported`);
    }

    if (hasSorting) {
      const infos = criteria.orderBy as FieldSortInfo[];
      sort(items, ...infos);
    }

    if (hasPaging) {
      applyPaging(items, criteria.page as number, criteria.size as number);
    }

    return Promise.resolve(items);
  }

  async findOne(criteria: FindCriteria): Promise<TRecord | null> {
    const items = await this.find(criteria);
    return items[0] ?? null;
  }

  async get(ids: TPrimaryField[]): Promise<TRecord[]> {
    const items: TRecord[] = [];
    for (const id of ids) {
      const item = await this.getOne(id);
      items.push(item);
    }

    return Promise.resolve(items);
  }

  getOne(id: TPrimaryField): Promise<TRecord> {
    const found: TRecord | undefined = this.findItemById(id);

    if (!found) {
      const values = this.isSingleField ? [id as string] : (id as string[]);
      const fields = this.isSingleField
        ? [this.idField as string]
        : (this.idField as string[]);

      throw new Error(
        `Unable to find item by [${fields.join(',')}] matching [${values.join(
          ','
        )}]`
      );
    }

    return Promise.resolve(found);
  }

  search(search: string, field = ''): TRecord[] {
    const searchAll = !field;
    return this.items.filter((item) => {
      const textToSearch: string = searchAll
        ? JSON.stringify(item)
        : String((item as KeyValue)[field]);
      const regex = new RegExp(search, 'i');
      return regex.test(textToSearch);
    });
  }

  insert(record: Partial<TRecord> | Partial<TRecord>[]): Promise<void> {
    const records = toArray(record);
    for (const item of records) {
      this.ensureId(item);
      this.items.push(item as TRecord);
    }

    return Promise.resolve();
  }

  insertAt(record: Partial<TRecord>, index: number): void {
    this.ensureId(record);
    this.items.splice(index, 0, record as TRecord);
  }

  put(record: Partial<TRecord> | Partial<TRecord>[]): Promise<void> {
    const records = toArray(record);
    for (const record of records) {
      const id = this.getRecordIdValue(record);
      const existing = id ? this.findItemById(id) : null;
      const index = existing ? this.items.indexOf(existing) : -1;
      const recordExists = index !== -1;

      this.remove(record);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      recordExists ? this.insertAt(record, index) : this.insert(record);
    }

    return Promise.resolve();
  }

  patch(values: Partial<TRecord> | Partial<TRecord>[]): Promise<void> {
    const updates = toArray(values);
    for (const update of updates) {
      const id = this.getRecordIdValue(update);
      const existing = id ? this.findItemById(id) : null;

      if (!existing) {
        throw new Error(`Can't find record with ID`);
      }

      Object.assign(existing, update);
    }

    return Promise.resolve();
  }

  remove(
    record:
      | TPrimaryField
      | TPrimaryField[]
      | Partial<TRecord>
      | Partial<TRecord>[]
  ): Promise<void> {
    const records = toArray(record);
    if (!records.length) {
      throw new Error('Nothing specified to remove.');
    }

    const isRecord = isObject(records[0]);
    const ids = isRecord
      ? records.map((r) => this.getRecordIdValue(r as Partial<TRecord>))
      : (records as TPrimaryField[]);

    for (const id of ids) {
      const existing = this.findItemById(id as TPrimaryField);
      removeItem(this.items, existing);
    }

    return Promise.resolve();
  }

  private findItemById(id: TPrimaryField): TRecord | undefined {
    this.items.find((item) => item);
    const isSingleField = isString(this.idField);
    return isSingleField
      ? this.findItemBySingleId(id as string)
      : this.findItemByCompositeId(id as string[]);
  }

  private findItemBySingleId(id: string): TRecord | undefined {
    const idFieldAsString = this.idField as string;
    return this.items.find(
      (item) => (item as KeyValue)[idFieldAsString] === (id as string)
    );
  }

  private findItemByCompositeId(idValues: string[]): TRecord | undefined {
    return this.items.find((item) => {
      const recordValues = this.getCompositeIdValues(item);
      return valuesMatch(idValues, recordValues);
    });
  }

  private ensureIdValues(): void {
    this.items.forEach((item) => this.ensureId(item));
  }

  private ensureId(record: Partial<TRecord>): void {
    const isSingleField = isString(this.idField);
    const idField = this.idField as string;

    if (isSingleField) {
      const asKeyValue = record as KeyValue;
      const id = asKeyValue[idField];

      if (isNotValue(id)) {
        asKeyValue[idField] = uuid();
      }
    } else {
      const compositeValues = this.getCompositeIdValues(record);
      if (anyNonValues(compositeValues)) {
        throw new Error('Items must have composite ID fields populated');
      }
    }
  }

  private getRecordIdValue(record: Partial<TRecord>): TPrimaryField {
    return this.isSingleField
      ? ((record as KeyValue)[this.idField as string] as TPrimaryField)
      : (this.getCompositeIdValues(record) as TPrimaryField);
  }

  private getCompositeIdValues(record: Partial<TRecord>): (string | number)[] {
    const idFields = this.idField as string[];
    return idFields.map(
      (field) => (record as KeyValue)[field] as string | number
    );
  }
}

function applyPaging<T>(items: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return items.slice(startIndex, endIndex);
}
