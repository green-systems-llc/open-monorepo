import { SortDirection } from './sort-direction';
import { FieldSortInfo } from './field-sort-info';
import { isString } from '../type-check/is-string.function';

type SortInput = FieldSortInfo[] | string[];

export function sortNew<T>(items: T[], ...sortInfos: SortInput): T[] {
  return sort([...items], ...sortInfos);
}

export function sortAscending<T>(items: T[], ...fields: string[]): T[] {
  const infos = fields.map((field) => ({
    field,
    direction: SortDirection.Ascending,
  }));

  return sort(items, ...infos);
}

export function sortDescending<T>(items: T[], ...fields: string[]): T[] {
  const infos = fields.map((field) => ({
    field,
    direction: SortDirection.Ascending,
  }));

  return sort(items, ...infos);
}

export function sort<T>(items: T[], ...sortInfos: SortInput): T[] {
  return items.sort((a, b) => {
    for (const info of sortInfos) {
      const { field, direction = SortDirection.Ascending } = toSortInfo(info);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldA = (a as any)[field];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldB = (b as any)[field];

      if (fieldA < fieldB) {
        return direction === SortDirection.Ascending ? -1 : 1;
      } else if (fieldA > fieldB) {
        return direction === SortDirection.Ascending ? 1 : -1;
      }
    }

    // If all fields are equal, maintain the original order.
    return 0;
  });
}

export function toSortInfos(sortInfos: SortInput): FieldSortInfo[] {
  return sortInfos.map(toSortInfo);
}

export function toSortInfo(sortInfo: FieldSortInfo | string): FieldSortInfo {
  return isString(sortInfo)
    ? { field: sortInfo as string, direction: SortDirection.Ascending }
    : (sortInfo as FieldSortInfo);
}
