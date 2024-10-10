import { isValue } from './is-value.function';

/**
 * Returns true if the value is null, undefined or an empty string.
 * @param value The value to test against
 * @returns True if not a value, otherwise false
 */
export function isNotValue(value: unknown): boolean {
  return !isValue(value);
}
