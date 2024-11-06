import { KeyValue } from '../object/key-value';
import {
  FindAllCriteria,
  FindCountCriteria,
  FindCriteria,
} from './find-criteria';

export type PrimaryFieldType = string | number | string[] | number[];

export interface ReadRepository<
  TPrimaryField extends PrimaryFieldType = string,
  TRecord = KeyValue
> {
  findAll(criteria?: FindAllCriteria): Promise<TRecord[]>;
  find(criteria: FindCriteria): Promise<TRecord[]>;
  countAll(): Promise<number>;
  count(criteria: FindCountCriteria): Promise<number>;
  findOne(criteria: FindCriteria): Promise<TRecord | null>;
  get(ids: TPrimaryField[]): Promise<TRecord[]>;
  getOne(id: TPrimaryField): Promise<TRecord>;
}

export interface WriteRepository<
  TPrimaryField extends PrimaryFieldType = string,
  TRecord = KeyValue
> {
  insert(record: Partial<TRecord> | Partial<TRecord>[]): Promise<void>;
  put(record: Partial<TRecord> | Partial<TRecord>[]): Promise<void>;
  patch(values: Partial<TRecord> | Partial<TRecord>[]): Promise<void>;
  remove(
    record:
      | Partial<TRecord>
      | Partial<TRecord>[]
      | TPrimaryField
      | TPrimaryField[]
  ): Promise<void>;
}

export interface Repository<
  TPrimaryField extends PrimaryFieldType = string,
  TRecord = KeyValue
> extends ReadRepository<TPrimaryField, TRecord>,
    WriteRepository<TPrimaryField, TRecord> {}
