'use strict';

var stream = require('stream');
var stat = require('./stat');
var normalizeOptions = require('./normalize-options');

module.exports = DirectoryReader;

/**
 * Asynchronously reads the contents of a directory and streams the results
 * via a {@link stream.Readable}.
 *
 * @param {string} dir - The absolute or relative directory path to read
 * @param {object} [options] - User-specified options, if any (see {@link normalizeOptions})
 * @param {object} internalOptions - Internal options that aren't part of the public API
 * @class
 */
function DirectoryReader(dir, options, internalOptions) {
  var reader = this;

  reader.options = options = normalizeOptions(options, internalOptions);

  // Indicates whether we should keep reading
  // This is set false if stream.Readable.push() returns false.
  reader.shouldRead = true;

  // The directories to read
  reader.queue = [{ path: dir, basePath: options.basePath, depth: 0 }];

  // The number of directories that are currently being processed
  reader.pending = 0;

  // The data that has been read, but not yet emitted
  reader.buffer = [];

  reader.stream = new stream.Readable({objectMode: true});
  reader.stream._read = function _read() {
    // Start (or resume) reading
    reader.shouldRead = true;

    // If we have data in the buffer, then send the next chunk
    if (reader.buffer.length > 0) {
      reader.emitFromBuffer();
    }

    // If we have directories queued, then start processing the next one
    if (reader.queue.length > 0) {
      reader.readNextDirectory();
    }

    reader.checkForEOF();
  };
}

/**
 * Reads the next directory in the queue
 */
DirectoryReader.prototype.readNextDirectory = function readNextDirectory() {
  var reader = this;
  var facade = reader.options.facade;
  var dir = reader.queue.shift();
  reader.pending++;

  // Read the directory listing
  facade.fs.readdir(dir.path, function(err, items) {
    if (err) {
      safeEmit(reader.stream, 'error', err);
      return reader.finishedReadingDirectory();
    }

    // Process each item in the directory
    facade.forEach(
      items,
      reader.processItem.bind(reader, dir),
      reader.finishedReadingDirectory.bind(reader, dir)
    );
  });
};

/**
 * This method is called after all items in a directory have been processed.
 *
 * NOTE: This does not necessarily mean that the reader is finished, since there may still
 * be other directories queued or pending.
 */
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

/**
 * Determines whether the reader has finished processing all items in all directories.
 * If so, then the "end" event is fired (via {@Readable#push})
 */
DirectoryReader.prototype.checkForEOF = function checkForEOF() {
  var reader = this;

  if (reader.buffer.length === 0 &&   // The stuff we've already read
  reader.pending === 0 &&             // The stuff we're currently reading
  reader.queue.length === 0) {        // The stuff we haven't read yet
    // There's no more stuff!
    reader.stream.push(null);
  }
};

/**
 * Processes a single item in a directory.
 *
 * If the item is a directory, and `option.deep` is enabled, then the item will be added
 * to the directory queue.
 *
 * If the item meets the filter criteria, then it will be emitted to the reader's stream.
 *
 * @param {object} dir - A directory object from the queue
 * @param {string} item - The name of the item (name only, no path)
 * @param {function} done - A callback function that is called after the item has been processed
 */
DirectoryReader.prototype.processItem = function processItem(dir, item, done) {
  var reader = this;
  var stream = reader.stream;
  var options = reader.options;

  var itemPath = dir.basePath + item;

  // Should we read this directory's subdirectories?
  var recurse = (options.depth - dir.depth) > 0;
  var fullPath = dir.path + options.sep + item;

  // Determine whether we need to call `fs.stat` on the path
  var needStats =
    options.stats ||     // the user wants fs.Stats objects returned
    options.emit ||      // we need to emit events based on the fs.Stats
    options.filter ||    // we neeed to filter based on the fs.Stats
    recurse;             // we need the fs.Stats to know if it's a directory

  // If we don't need stats, then exit early
  if (!needStats) {
    reader.emitOrBuffer({ data: itemPath });
    return done();
  }

  // Get the fs.Stats object for this path
  stat(options.facade.fs, fullPath, function(err, stats) {
    if (err) {
      safeEmit(stream, 'error', err);
      return done();
    }

    if (recurse && stats.isDirectory()) {
      // Add this subdirectory to the queue
      reader.queue.push({
        path: fullPath,
        basePath: itemPath + options.sep,
        depth: dir.depth + 1,
      });
    }

    // Determine whether this item matches the filter criteria
    stats.path = itemPath;
    var meetsCriteria = !options.filter || safeCall(stream, options.filter, stats);

    if (meetsCriteria) {
      reader.emitOrBuffer({
        data: options.stats ? stats : itemPath,
        file: stats.isFile(),
        directory: stats.isDirectory(),
        symlink: stats.isSymbolicLink(),
      });
    }

    done();
  });
};

/**
 * Emits the given chunk of data or adds it to the buffer, depending on the state of the stream.
 *
 * @param {object} chunk
 */
DirectoryReader.prototype.emitOrBuffer = function emitOrBuffer(chunk) {
  var reader = this;

  // Add the chunk to the buffer
  reader.buffer.push(chunk);

  // If we're still reading, then immediately emit the next chunk in the buffer
  // (which may or may not be the chunk that we just added)
  if (reader.shouldRead) {
    reader.emitFromBuffer();
  }
};

/**
 * Immediately emits the next chunk in the buffer to the reader's stream.
 * The "data" event will always be fired (via {@link Readable#push}).
 * In addition, the "file", "directory", and/or "symlink" events may be fired,
 * depending on the type of properties of the chunk.
 */
DirectoryReader.prototype.emitFromBuffer = function emitFromBuffer() {
  var reader = this;
  var stream = reader.stream;
  var chunk = reader.buffer.shift();

  // Stream the data
  try {
    this.shouldRead = stream.push(chunk.data);
  }
  catch (error) {
    safeEmit(stream, 'error', error);
  }

  // Also emit specific events, based on the type of chunk
  chunk.file && safeEmit(stream, 'file', chunk.data);
  chunk.symlink && safeEmit(stream, 'symlink', chunk.data);
  chunk.directory && safeEmit(stream, 'directory', chunk.data);
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
    if (eventName === 'error') {
      // Don't recursively emit "error" events.
      // If the first one fails, then just throw
      throw error;
    }
    else {
      safeEmit(emitter, 'error', error);
    }
  }
}

/**
 * Calls the given function with the given arguments.
 * If the function throws an error, then an "error" event is emitted.
 *
 * @param {EventEmitter} emitter
 * @param {function} fn
 * @param {...*} args
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
