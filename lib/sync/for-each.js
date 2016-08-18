'use strict';

module.exports = syncForEach;

function syncForEach(array, iterator, done) {
  array.forEach(function(item) {
    iterator(item, function() {});
  });
  done();
}
