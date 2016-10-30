'use strict';

module.exports = syncForEach;

/**
 * A facade that allows {@link Array.forEach} to be called as though it were asynchronous.
 *
 * @param {array} array - The array to iterate over
 * @param {function} iterator - The function to call for each item in the array
 * @param {function} done - The function to call when all iterators have completed
 */
function syncForEach (array, iterator, done) {
  array.forEach(function (item) {
    iterator(item, function () {});
  });
  done();
}
