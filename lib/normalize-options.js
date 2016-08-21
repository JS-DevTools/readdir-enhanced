'use strict';

var path = require('path');

module.exports = normalizeOptions;

/**
 * Validates and normalizes the options argument
 *
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
 * @returns {object}
 */
function normalizeOptions(options) {
  if (options == null) {
    options = {};
  }
  else if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }

  var depth = options.deep;
  if (depth == null || typeof depth === 'boolean') {
    depth = depth ? Infinity : 0;
  }
  else if (typeof depth === 'number') {
    if (depth < 0 || isNaN(depth)) {
      throw new Error('options.deep must be a positive number');
    }
    else if (Math.floor(depth) !== depth) {
      throw new Error('options.deep must be an integer');
    }
  }
  else {
    throw new TypeError('options.deep must be a boolean or number');
  }

  var filter = options.filter;
  if (filter == null) {
    filter = function() { return true; };
  }
  else if (typeof filter !== 'function') {
    throw new TypeError('options.filter must be a function');
  }

  var sep = options.sep;
  if (sep == null) {
    sep = path.sep;
  }
  else if (typeof sep !== 'string') {
    throw new TypeError('options.sep must be a string');
  }

  var basePath = options.basePath;
  if (basePath == null) {
    basePath = '';
  }
  else if (typeof basePath === 'string') {
    // Append a path separator to the basePath, if necessary
    if (['/', '\\'].indexOf(basePath.substr(-1)) === -1) {
      basePath += sep;
    }
  }
  else {
    throw new TypeError('options.basePath must be a string');
  }

  return {
    depth: depth,
    filter: filter,
    sep: sep,
    basePath: basePath,
  };
}
