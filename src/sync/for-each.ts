import { Iterator, VoidCallback } from "../types-internal";

/**
 * A facade that allows {@link Array.forEach} to be called as though it were asynchronous.
 *
 * @param array - The array to iterate over
 * @param iterator - The function to call for each item in the array
 * @param done - The function to call when all iterators have completed
 *
 * @internal
 */
export function syncForEach<T>(array: T[], iterator: Iterator<T>, done: VoidCallback): void {
  if (!Array.isArray(array)) {
    throw new TypeError(`${array} is not an array`);
  }

  for (let item of array) {
    iterator(item, () => {
      // Note: No error-handling here because this is currently only ever called
      // by DirectoryReader, which never passes an `error` parameter to the callback.
      // Instead, DirectoryReader emits an "error" event if an error occurs.
    });
  }

  done();
}
