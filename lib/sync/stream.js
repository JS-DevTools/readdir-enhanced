'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

exports.Readable = SyncStream;

/**
 * A {@link stream.Readable} facade that reads the entire stream synchronously.
 */
function SyncStream() {
  EventEmitter.call(this);
}

util.inherits(SyncStream, EventEmitter);

/**
 * Synchronously reads all data from the stream.
 * All "data" events will be emitted before this method returns.
 */
SyncStream.prototype.resume = function() {
  this._read();
};

/**
 * Emits a "data" event with the given data.
 *
 * @param {*} data - The data to emit, or `null` to end the stream.
 * @returns {boolean}
 */
SyncStream.prototype.push = function(data) {
  if (data === null) {
    return false;
  }
  else {
    this.emit('data', data);
    this._read();
    return true;
  }
};
