import { FieldSortInfo } from '../sort/field-sort-info';

interface OrderByOptions {
  orderBy: FieldSortInfo[] | string[];
}

export interface FindAllCriteria extends Partial<OrderByOptions> {
  abort?: AbortSignal;
}

export interface FindByPageCriteria extends Partial<OrderByOptions> {
  page: number;
  size: number;
}

export interface FindBySearchCriteria
  extends Partial<FindByPageCriteria>,
    Partial<OrderByOptions> {
  search: string;
}

export interface FindByQueryCriteria
  extends Partial<FindByPageCriteria>,
    Partial<OrderByOptions> {
  query: string;
}

export type FindCriteria =
  | FindByPageCriteria
  | FindBySearchCriteria
  | FindByQueryCriteria;

export type AnyFindCriteria = Partial<
  FindByPageCriteria & FindBySearchCriteria & FindByQueryCriteria
>;
