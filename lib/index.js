'use strict';

var maybe = require('call-me-maybe');
var Promise = require('./promise');
var asyncHelpers = require('./async');
var syncHelpers = require('./sync');
var readdirStream = require('./readdir-stream');

module.exports = exports = readdirAsyncPath;
exports.readdir = exports.readdirAsync = exports.async = readdirAsyncPath;
exports.readdirAsyncStat = exports.async.stat = readdirAsyncStat;
exports.readdirStream = exports.stream = readdirStreamPath;
exports.readdirStreamStat = exports.stream.stat = readdirStreamStat;
exports.readdirSync = exports.sync = readdirSyncPath;
exports.readdirSyncStat = exports.sync.stat = readdirSyncStat;

/**
 * Synchronous readdir that returns an array of string paths.
 */
function readdirSyncPath(dir, options) {
  return readdirSync(dir, options, function(stats) {
    return stats.path;
  });
}

/**
 * Synchronous readdir that returns results as an array of {@link fs.Stats} objects
 */
function readdirSyncStat(dir, options) {
  return readdirSync(dir, options, function(stats) {
    return stats;
  });
}

/**
 * Calls {@link readdirStream} synchronously, and returns the buffered results.
 */
function readdirSync(dir, options, map) {
  var results = [], error;

  var stream = readdirStream(syncHelpers, dir, options, map);
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

/**
 * Aynchronous readdir (accepts an error-first callback or returns a {@link Promise}).
 * Results are an array of path strings.
 */
function readdirAsyncPath(dir, options, callback) {
  return readdirAsync(dir, options, callback, function(stats) {
    return stats.path;
  });
}

/**
 * Aynchronous readdir (accepts an error-first callback or returns a {@link Promise}).
 * Results are an array of {@link fs.Stats} objects.
 */
function readdirAsyncStat(dir, options, callback) {
  return readdirAsync(dir, options, callback, function(stats) {
    return stats.path;
  });
}

/**
 * Calls {@link readdirStream}, and returns the buffered results via
 * an error-first callback or a {@link Promise}.
 */
function readdirAsync(dir, options, callback, map) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  return maybe(callback, new Promise(function(resolve, reject) {
    var results = [];

    var stream = readdirStream(asyncHelpers, dir, options, map);
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

/**
 * Aynchronous readdir that returns a {@link stream.Readable} (which is also an {@link EventEmitter}).
 * All stream data events ("data", "file", "directory", "symlink") are passed a path string.
 */
function readdirStreamPath(dir, options) {
  return readdirStream(asyncHelpers, dir, options, function(stats) {
    return stats.path;
  });
}

/**
 * Aynchronous readdir that returns a {@link stream.Readable} (which is also an {@link EventEmitter})
 * All stream data events ("data", "file", "directory", "symlink") are passed an {@link fs.Stats} object.
 */
function readdirStreamStat(dir, options) {
  return readdirStream(asyncHelpers, dir, options, function(stats) {
    return stats;
  });
}
