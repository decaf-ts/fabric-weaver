/**
 * Overrides properties of the target object with non-undefined values from the source object.
 *
 * @param target The object to be modified
 * @param source The object containing override values
 * @returns The modified target object
 */
export function overrideNonUndefined<T extends object>(
  target: T,
  source: Partial<T>
): T {
  for (const key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      source[key] !== undefined
    ) {
      target[key] = source[key] as T[typeof key];
    }
  }
  return target;
}
