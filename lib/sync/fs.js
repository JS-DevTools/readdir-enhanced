'use strict';

var fs = require('fs');

exports.readdir = function(dir, callback) {
  try {
    var items = fs.readdirSync(dir);
    callback(null, items);
  }
  catch (err) {
    callback(err);
  }
};

exports.stat = function(path, callback) {
  try {
    var stats = fs.statSync(path);
    callback(null, stats);
  }
  catch (err) {
    callback(err);
  }
};

exports.lstat = function(path, callback) {
  try {
    var stats = fs.lstatSync(path);
    callback(null, stats);
  }
  catch (err) {
    callback(err);
  }
};
