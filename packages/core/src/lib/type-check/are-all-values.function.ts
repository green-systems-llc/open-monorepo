import { isValue } from './is-value.function';

export function areAllValues(values: unknown[]): boolean {
  return values.every(isValue);
}
