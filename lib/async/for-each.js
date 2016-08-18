'use strict';

module.exports = asyncForEach;

function asyncForEach(array, iterator, done) {
  if (array.length === 0) {
    done();
    return;
  }

  var pending = array.length;
  array.forEach(function(item) {
    iterator(item, function() {
      if (--pending === 0) {
        done();
      }
    });
  });
}
