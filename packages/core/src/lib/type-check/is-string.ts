/**
 * Returns true if the value is a string.
 * @param value The value to test against
 * @returns True if is a string, otherwise false
 */
export function isString(value: unknown): boolean {
  return typeof value === 'string';
}
