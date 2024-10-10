export function toArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? (item as T[]) : [item];
}
