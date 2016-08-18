'use strict';

var syncFS = require('./fs');
var SyncStream = require('./stream');
var syncForEach = require('./for-each');

exports.readdir = syncFS.readdir;
exports.stat = syncFS.stat;
exports.lstat = syncFS.lstat;
exports.ReadableStream = SyncStream;
exports.forEach = syncForEach;
