import { isObject } from './is-object.function';

export function isNotObject(value: unknown): boolean {
  return !isObject(value);
}
