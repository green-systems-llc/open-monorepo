/**
 * Returns true if the value is not null, undefined or an empty string.
 * @param value The value to test against
 * @returns True if a value, otherwise false
 */
export function isValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}
