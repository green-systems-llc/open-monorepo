import { areAllValues } from './are-all-values.function';

export function anyNonValues(values: unknown[]): boolean {
  return !areAllValues(values);
}
