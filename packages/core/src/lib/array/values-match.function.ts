export function valuesMatch(items: unknown[], items2: unknown[]): boolean {
  return (
    items.length === items2.length &&
    items.every((item, index) => item === items2[index])
  );
}
