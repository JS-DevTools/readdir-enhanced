'use strict';

var readdirSync = require('./sync');
var readdirAsync = require('./async');
var readdirStream = require('./stream');

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
  return readdirSync(dir, options, pathMap);
}

/**
 * Synchronous readdir that returns results as an array of {@link fs.Stats} objects
 */
function readdirSyncStat(dir, options) {
  return readdirSync(dir, options);
}

/**
 * Aynchronous readdir (accepts an error-first callback or returns a {@link Promise}).
 * Results are an array of path strings.
 */
function readdirAsyncPath(dir, options, callback) {
  return readdirAsync(dir, options, callback, pathMap);
}

/**
 * Aynchronous readdir (accepts an error-first callback or returns a {@link Promise}).
 * Results are an array of {@link fs.Stats} objects.
 */
function readdirAsyncStat(dir, options, callback) {
  return readdirAsync(dir, options, callback);
}

/**
 * Aynchronous readdir that returns a {@link stream.Readable} (which is also an {@link EventEmitter}).
 * All stream data events ("data", "file", "directory", "symlink") are passed a path string.
 */
function readdirStreamPath(dir, options) {
  return readdirStream(dir, options, pathMap);
}

/**
 * Aynchronous readdir that returns a {@link stream.Readable} (which is also an {@link EventEmitter})
 * All stream data events ("data", "file", "directory", "symlink") are passed an {@link fs.Stats} object.
 */
function readdirStreamStat(dir, options) {
  return readdirStream(dir, options);
}

function pathMap(stat) {
  return stat.path;
}
