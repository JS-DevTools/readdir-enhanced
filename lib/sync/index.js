'use strict';

module.exports = readdirSync;

var DirectoryReader = require('../directory-reader');

var syncFacade = {
  fs: require('./fs'),
  stream: require('./stream'),
  forEach: require('./for-each'),
};

/**
 * Returns the buffered output from a synchronous {@link DirectoryReader}.
 */
function readdirSync(dir, options, map) {
  var results = [], error;

  var reader = new DirectoryReader(syncFacade, dir, options, map);
  var stream = reader.stream;

  stream.pause();
  stream.on('error', function(err) {
    error = err;
    stream.pause();
  });
  stream.on('data', function(result) {
    results.push(result);
  });
  stream.resume();

  if (error) {
    throw error;
  }
  else {
    return results;
  }
}
