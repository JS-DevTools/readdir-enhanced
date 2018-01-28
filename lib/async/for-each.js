'use strict';

module.exports = asyncForEach;

/**
 * Simultaneously processes all items in the given array.
 *
 * @param {DirectoryReader} ctx - The DirectoryReader context
 * @param {object} dir - The current queue item
 * @param {array} array - The array to iterate over
 * @param {function} iterator - The function to call for each item in the array
 * @param {function} done - The function to call when all iterators have completed
 */
function asyncForEach (ctx, dir, array, iterator, done) {
  if (array.length === 0) {
    // NOTE: Normally a bad idea to mix sync and async, but it's safe here because
    // of the way that this method is currently used by DirectoryReader.
    done.call(ctx);
    return;
  }

  // Simultaneously process all items in the array.
  let pending = array.length;
  array.forEach(item => {
    iterator.call(ctx, dir, item, () => {
      if (--pending === 0) {
        done.call(ctx);
      }
    });
  });
}
