import { Iterator, VoidCallback } from "../types-internal";

/**
 * Simultaneously processes all items in the given array.
 *
 * @param array - The array to iterate over
 * @param iterator - The function to call for each item in the array
 * @param done - The function to call when all iterators have completed
 *
 * @internal
 */
export function asyncForEach<T>(array: T[], iterator: Iterator<T>, done: VoidCallback): void {
  if (!Array.isArray(array)) {
    throw new TypeError(`${array} is not an array`);
  }

  if (array.length === 0) {
    // NOTE: Normally a bad idea to mix sync and async, but it's safe here because
    // of the way that this method is currently used by DirectoryReader.
    done();
    return;
  }

  // Simultaneously process all items in the array.
  let pending = array.length;
  for (let item of array) {
    iterator(item, callback);
  }

  function callback() {
    if (--pending === 0) {
      done();
    }
  }
}
