'use strict';

module.exports = readdirStream;

var DirectoryReader = require('../directory-reader');

var asyncFacade = {
  fs: require('../async/fs'),
  stream: require('stream'),
  forEach: require('../async/for-each'),
};

/**
 * Returns the {@link stream.Readable} of an asynchronous {@link DirectoryReader}.
 *
 * @param {string} dir
 * @param {object} [options]
 * @param {function} [map]
 */
function readdirStream(dir, options, map) {
  var reader = new DirectoryReader(asyncFacade, dir, options, map);
  return reader.stream;
}
