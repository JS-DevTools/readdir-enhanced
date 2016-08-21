'use strict';

module.exports = readdirAsync;

var maybe = require('call-me-maybe');
var Promise = require('./promise');
var DirectoryReader = require('../directory-reader');

var asyncFacade = {
  fs: require('./fs'),
  stream: require('stream'),
  forEach: require('./for-each'),
};

/**
 * Returns the buffered output from an asynchronous {@link DirectoryReader},
 * via an error-first callback or a {@link Promise}.
 */
function readdirAsync(dir, options, callback, map) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  return maybe(callback, new Promise(function(resolve, reject) {
    var results = [];

    var reader = new DirectoryReader(asyncFacade, dir, options, map);
    var stream = reader.stream;

    stream.on('error', function(err) {
      reject(err);
      stream.pause();
    });
    stream.on('data', function(result) {
      results.push(result);
    });
    stream.on('end', function() {
      resolve(results);
    });
  }));
}
