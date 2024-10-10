/**
 * Removes an item from an array.
 * @param list The list to remove the item from.
 * @param item The item to remove out of the list.
 */
export function removeItem(list: unknown[], item: unknown): boolean {
  const index = list.findIndex((i) => i === item);
  if (index === -1) {
    return false;
  }

  list.splice(index, 1);
  return true;
}
