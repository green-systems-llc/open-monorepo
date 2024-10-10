export function clone<T>(item: T): T {
  const json = JSON.stringify(item);
  return JSON.parse(json);
}
