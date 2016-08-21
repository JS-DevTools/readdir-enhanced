'use strict';

var stat = require('./stat');
var normalizeOptions = require('./normalize-options');

module.exports = DirectoryReader;

/**
 * Asynchronously reads the contents of a directory and streams the results
 * via a {@link stream.Readable}.
 *
 * @param {object} facade - Synchronous or Asynchronouse facades for underlying Node APIs
 * @param {object} [options] - Options to control behavior (see {@link normalizeOptions})
 * @param {function} [map] - A function that maps {@link fs.Stats} objects to data that will be streamed
 * @class
 */
function DirectoryReader(facade, dir, options, map) {
  var reader = this;

  this.facade = facade;
  this.options = normalizeOptions(options);
  this.map = map;

  // Indicates whether we should keep reading
  // This is set false if stream.Readable.push() returns false.
  this.shouldRead = true;

  // The directories to read
  this.queue = [{ path: dir, basePath: reader.options.basePath, depth: 0 }];

  // The number of directories that are currently being processed
  this.pending = 0;

  // The data that has been read so far
  this.data = [];

  this.stream = new facade.stream.Readable({
    objectMode: true,
    read: function() {
      // Start (or resume) reading
      reader.shouldRead = true;

      // If we have data, then send the next chunk
      if (reader.data.length > 0) {
        reader.emitData();
      }

      // If we have directories queued, then start processing the next one
      if (reader.queue.length > 0) {
        reader.readNextDirectory();
      }

      reader.checkForEOF();
    }
  });
}

DirectoryReader.prototype.readNextDirectory = function readNextDirectory() {
  var reader = this;
  var dir = reader.queue.shift();
  reader.pending++;

  // Read the directory listing
  reader.facade.fs.readdir(dir.path, function(err, items) {
    if (err) {
      safeEmit(reader.stream, 'error', err);
      return reader.finishedReadingDirectory();
    }

    // Process each item in the directory
    reader.facade.forEach(
      items,
      reader.processItem.bind(reader, dir),
      reader.finishedReadingDirectory.bind(reader, dir)
    );
  });
};

DirectoryReader.prototype.finishedReadingDirectory = function finishedReadingDirectory() {
  var reader = this;
  reader.pending--;

  if (reader.shouldRead) {
    // If we have directories queued, then start processing the next one
    if (reader.queue.length > 0) {
      reader.readNextDirectory();
    }

    reader.checkForEOF();
  }
};

DirectoryReader.prototype.checkForEOF = function checkForEOF() {
  var reader = this;

  if (reader.data.length === 0 &&     // The stuff we've already read
  reader.pending === 0 &&             // The stuff we're currently reading
  reader.queue.length === 0) {        // The stuff we haven't read yet
    // There's no more stuff!
    reader.stream.push(null);
  }
};

DirectoryReader.prototype.processItem = function processItem(dir, item, done) {
  var reader = this;
  var stream = reader.stream;

  var itemPath = dir.basePath + item;
  var fullPath = dir.path + reader.options.sep + item;

  // Should we read this directory's subdirectories?
  var recurse = (reader.options.depth - dir.depth) > 0;

  stat(reader.facade.fs, fullPath, function(err, stats) {
    if (err) {
      safeEmit(stream, 'error', err);
      return done();
    }

    if (recurse && stats.isDirectory()) {
      // Add this subdirectory to the queue
      reader.queue.push({
        path: fullPath,
        basePath: itemPath + reader.options.sep,
        depth: dir.depth + 1,
      });
    }

    // Determine whether this item matches the filter criteria
    stats.path = itemPath;
    if (safeCall(stream, reader.options.filter, stats)) {
      // This item matches the filter criteria
      reader.data.push(stats);

      // Emit the data immediately, unless the reader has been told to stop reading
      if (reader.shouldRead) {
        reader.emitData();
      }
    }

    done();
  });
};

DirectoryReader.prototype.emitData = function emitData() {
  var reader = this;
  var stream = reader.stream;
  var stats = reader.data.shift();

  // Map the data to the desired output format, if necessary
  var data = stats;
  if (reader.map) {
    data = reader.map(stats);
  }

  // Stream the data
  try {
    this.shouldRead = stream.push(data);
  }
  catch (error) {
    safeEmit(stream, 'error', error);
  }

  // Also emit specific events, based on the type of item
  if (stats.isFile()) {
    safeEmit(stream, 'file', data);
  }
  if (stats.isSymbolicLink()) {
    safeEmit(stream, 'symlink', data);
  }
  if (stats.isDirectory()) {
    safeEmit(stream, 'directory', data);
  }
};

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
