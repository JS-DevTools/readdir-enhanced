'use strict';

var path = require('path');
var stat = require('./stat');

module.exports = readdirStream;

/**
 * Asynchronously reads the contents of a directory and streams the results
 * via a {@link stream.Readable}.
 *
 * @param {object} helpers - A facade for synchronous or asynchronous helper functions
 * @param {string} dir - The directory to read
 * @param {object} [options]
 *
 * @param {number|boolean} [options.deep]
 * The number of directories to recursively traverse. Any falsy value or negative number will
 * default to zero, so only the top-level contents will be returned. Set to `true` or `Infinity`
 * to traverse all subdirectories.
 *
 * @param {function} [options.filter]
 * A function that accepts a {@link fs.Stats} object and returns a truthy value if the data should
 * be returned.
 *
 * @param {string} [options.sep]
 * The path separator to use. By default, the OS-specific separator will be used, but this can be
 * set to a specific value to ensure consistency across platforms.
 *
 * @param {string} [options.basePath]
 * The base path to prepend to each result. If empty, then all results will be relative to `dir`.
 *
 * @param {function} map
 * A function that maps {@link fs.Stats} objects to data that will be streamed
 */
function readdirStream(helpers, dir, options, map) {
  options = options || {};
  var depth = options.deep === true ? Infinity : options.deep > 0 ? Math.floor(options.deep) : 0;
  var filter = options.filter || function() { return true; };
  var sep =  options.sep || path.sep;
  var basePath = options.basePath || '';

  // Append a path separator to the basePath, if necessary
  if (basePath && ['/', '\\'].indexOf(basePath.substr(-1)) === -1) {
    basePath += sep;
  }

  // Add the top-level directory to the queue
  var queue = [{ path: dir, basePath: basePath, depth: 0 }];
  var pending = 0;

  // Start the reader
  return new helpers.ReadableStream({
    objectMode: true,
    read: function() {
      var me = this;

      if (queue.length === 0) {
        // The queue is empty right now, so do nothing
        return;
      }

      // Start processing the next directory in the queue
      var dir = queue.shift();
      pending++;

      // Should we read this directory's subdirectories?
      var recurse = (depth - dir.depth) > 0;

      helpers.readdir(dir.path, function(err, items) {
        if (err) {
          safeEmit(me, 'error', err);
          return directoryProcessed();
        }

        // Process each item in the directory
        pending += items.length;
        helpers.forEach(items, processItem, directoryProcessed);

        function processItem(item, forEachCallback) {
          var itemPath = dir.basePath + item;
          var fullPath = dir.path + sep + item;

          stat(helpers, fullPath, function(err, stats) {
            if (err) {
              safeEmit(me, 'error', err);
              return forEachCallback();
            }

            if (recurse && stats.isDirectory()) {
              // Add this subdirectory to the queue
              queue.push({
                path: fullPath,
                basePath: itemPath,
                depth: dir.depth + 1,
              });
            }

            // Determine whether this item matches the filter criteria
            stats.path = itemPath;
            if (safeCall(me, filter, stats)) {
              // This item matches the filter criteria. So map it to the data that will be streamed
              var data = map(stats);

              // Stream the data
              me.push(data);
              pending--;

              // Also emit specific events, based on the type of item
              if (stats.isFile()) {
                safeEmit(me, 'file', data);
              }
              if (stats.isSymbolicLink()) {
                safeEmit(me, 'symlink', data);
              }
              if (stats.isDirectory()) {
                safeEmit(me, 'directory', data);
              }
            }

            forEachCallback();
          });
        }

        // We're done processing this directory
        function directoryProcessed() {
          pending--;

          if (pending === 0) {
            // We're done processing all directories
            me.push(null);
          }
        }
      });
    },
  });
}

/**
 * Emits an event.  If one of the event listeners throws an error,
 * then an "error" event is emitted.
 *
 * @param {EventEmitter} emitter
 * @param {string} eventName
 * @param {*} data
 */
function safeEmit(emitter, eventName, data) {
  try {
    emitter.emit(eventName, data);
  }
  catch (error) {
    safeEmit(emitter, 'error', error);
  }
}

/**
 * Calls the given function with the given arguments.
 * If the function throws an error, then an "error" event is emitted.
 *
 * @param {EventEmitter} emitter
 * @param {string} eventName
 * @param {*} data
 */
function safeCall(emitter, fn, args) {
  try {
    args = Array.prototype.slice.call(arguments, 2);
    return fn.apply(null, args);
  }
  catch (error) {
    safeEmit(emitter, 'error', error);
  }
}
