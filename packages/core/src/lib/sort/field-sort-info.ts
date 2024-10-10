import { SortDirection } from './sort-direction';

export interface FieldSortInfo {
  field: string;
  direction?: SortDirection;
}

export type FieldSortInfos = FieldSortInfo[];
