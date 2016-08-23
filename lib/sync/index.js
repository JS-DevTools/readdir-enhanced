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
 *
 * @param {string} dir
 * @param {object} [options]
 * @param {object} internalOptions
 */
function readdirSync(dir, options, internalOptions) {
  var results = [], error;

  internalOptions.facade = syncFacade;

  var reader = new DirectoryReader(dir, options, internalOptions);
  var stream = reader.stream;

  stream.on('error', function(err) {
    error = err;
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
