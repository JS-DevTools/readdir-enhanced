'use strict';

module.exports = asyncForEach;

/**
 * A simple async implemenation of {@link Array.forEach}.
 *
 * @param {array} array - The array to iterate over
 * @param {function} iterator - The function to call for each item in the array
 * @param {function} done - The function to call when all iterators have completed
 */
function asyncForEach (array, iterator, done) {
  if (array.length === 0) {
    done();
    return;
  }

  var pending = array.length;
  array.forEach(function (item) {
    iterator(item, function () {
      if (--pending === 0) {
        done();
      }
    });
  });
}
