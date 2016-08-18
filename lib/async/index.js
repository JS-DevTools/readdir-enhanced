'use strict';

var fs = require('fs');
var stream = require('stream');
var asyncForEach = require('./for-each');

exports.readdir = fs.readdir;
exports.stat = fs.stat;
exports.lstat = fs.lstat;
exports.ReadableStream = stream.Readable;
exports.forEach = asyncForEach;
