import { isString } from './is-string.function';

/**
 * Returns true if the value is not a string.
 * @param value The value to test against
 * @returns True if not a string, otherwise false
 */
export function isNotString(value: unknown): boolean {
  return !isString(value);
}
