Enhanced `fs.readdir()`
=======================

[![Build Status](https://api.travis-ci.org/BigstickCarpet/readdir-enhanced.svg)](https://travis-ci.org/BigstickCarpet/readdir-enhanced)
[![Dependencies](https://david-dm.org/BigstickCarpet/readdir-enhanced.svg)](https://david-dm.org/BigstickCarpet/readdir-enhanced)
[![Coverage Status](https://coveralls.io/repos/BigstickCarpet/readdir-enhanced/badge.svg?branch=master&service=github)](https://coveralls.io/r/BigstickCarpet/readdir-enhanced)
[![Codacy Score](https://api.codacy.com/project/badge/Grade/178a817b6c864de7813fef457c0ed5ae)](https://www.codacy.com/public/jamesmessinger/readdir-enhanced)
[![Inline docs](http://inch-ci.org/github/BigstickCarpet/readdir-enhanced.svg?branch=master&style=shields)](http://inch-ci.org/github/BigstickCarpet/readdir-enhanced)

[![npm](https://img.shields.io/npm/v/readdir-enhanced.svg?maxAge=43200)](https://www.npmjs.com/package/readdir-enhanced)
[![License](https://img.shields.io/npm/l/readdir-enhanced.svg?maxAge=2592000)](LICENSE)

`readdir-enhanced` enhances Node.js' built-in [`fs.readdir()`](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback) and [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) methods to support additional syntaxes (Promises, Streams, EventEmitter) and features ([filtering](#filter), [recursion](#deep), [absolute paths](#basepath), [stats](#stats), and more).


Pick Your API
-----------------
`readdir-enhanced` has multiple APIs, so you can pick whichever one you prefer.  There are three main APIs:

- **Synchronous API**<br>
aliases: `readdir.sync`, `readdir.readdirSync`<br>
Blocks the thread until all directory contents are read, and then returns all the results.

- **Async API**<br>
aliases: `readdir`, `readdir.async`, `readdir.readdirAsync`<br>
Reads the directory contents asynchronously and buffers all the results until all contents have been read. Supports callback or Promise syntax (see example below).

- **Streaming API**<br>
aliases: `readdir.stream`, `readdir.readdirStream`<br>
The streaming API reads the directory asynchronously and returns the results in real-time as they are read. The results can be [piped](https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options) to other Node.js streams, or you can listen for specific events via the [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) interface. (see example below)

```javascript
var readdir = require('readdir-enhanced');
var through2 = require('through2');

// Synchronous API
var files = readdir.sync('my/directory');

// Callback API
readdir.async('my/directory', function(err, files) { ... });

// Promises API
readdir.async('my/directory')
  .then(function(files) { ... })
  .catch(function(err) { ... });

// EventEmitter API
readdir.stream('my/directory')
  .on('data', function(path) { ... })
  .on('file', function(path) { ... })
  .on('directory', function(path) { ... })
  .on('symlink', function(path) { ... })
  .on('error', function(err) { ... });

// Streaming API
var stream = readdir.stream('my/directory')
  .pipe(through2.obj(function(data, enc, next) {
    console.log(data);
    this.push(data);
    next();
  });
```


Enhanced Features <a id="options"></a>
-----------------
`readdir-enhanced` adds several features to the built-in `fs.readdir()` function.  All of the enhanced features are opt-in, which makes `readdir-enhanced` [fully backward compatible by default](#backward-compatible).  You can enable any of the features by passing-in an `options` argument as the second parameter.


### Recursion - `options.deep` <a id="deep"></a>
By default, `readdir-enhanced` will only return the top-level contents of the directory. But you can enable the `deep` option to recursively traverse the subdirectories and return their contents as well.

The `deep` option can be set to `true` to traverse the entire directory structure, or it can be set to a number to only traverse that many levels deep.  For example, calling `readdir('my/directory', {deep: 2})` will return `subdir1/file.txt` and `subdir1/subdir2/file.txt`, but it _won't_ return `subdir1/subdir2/subdir3/file.txt`.

```javascript
var readdir = require('readdir-enhanced');

readdir('my/directory', {deep: true}, function(err, files) {
  console.log(files);
  // => subdir1
  // => subdir1/file.txt
  // => subdir1/subdir2
  // => subdir1/subdir2/file.txt
  // => subdir1/subdir2/subdir3
  // => subdir1/subdir2/subdir3/file.txt
  // ...
});
```


### Filtering - `options.filter` <a id="filter"></a>
You can filter the results by whatever criteria you want, by specifying a filter function. The function accepts an [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object and should return a truthy value to include the item in the results.

> **NOTE:** The [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object that is passed to the filter function has an additional `path` property. The `path` is relative to the directory by default, but you can customize this via [`options.basePath`](#basepath).

```javascript
var readdir = require('readdir-enhanced');

// Only return subdirectories containing an underscore
function myFilter(stats) {
  return stats.isDirectory() && stats.path.indexOf('_') >= 0;
}

readdir('my/directory', {filter: myFilter}, function(err, subdirs) {
  console.log(subdirs);
  // => _tmp
  // => bower_components
  // => node_modules
  // ...
});
```


### Base Path - `options.basePath` <a id="basepath"></a>
By default all `readdir-enhanced` functions return paths that are relative to the directory. But you can use the `basePath` option to customize this.  The `basePath` will be prepended to all of the returned paths.  One common use-case for this is to set `basePath` to the absolute path of the directory, so that all of the returned paths will be absolute.

```javascript
var readdir = require('readdir-enhanced');
var path = require('path');

// Get absolute paths
var absPath = path.resolve('my/dir');
readdir('my/directory', {basePath: absPath}, function(err, files) {
  console.log(files);
  // => /absolute/path/to/my/directory/file1.txt
  // => /absolute/path/to/my/directory/file2.txt
  // => /absolute/path/to/my/directory/subdir
  // ...
});

// Get paths relative to the current directory
readdir('my/directory', {basePath: 'my/directory'}, function(err, files) {
  console.log(files);
  // => my/directory/file1.txt
  // => my/directory/file2.txt
  // => my/directory/subdir
  // ...
});
```


### Path Separator - `options.sep` <a id="sep"></a>
By default, `readdir-enhanced` uses the correct path separator for your OS (`\` on Windows, `/` on Linux & MacOS). But you can set the `sep` option to any separator character(s) that you want to use instead.  This is usually used to ensure consistent path separators across different OSes.

```javascript
var readdir = require('readdir-enhanced');

// Always use Windows path separators
readdir('my/directory', {sep: '\\', deep: true}, function(err, files) {
  console.log(files);
  // => subdir1
  // => subdir1\file.txt
  // => subdir1\subdir2
  // => subdir1\subdir2\file.txt
  // => subdir1\subdir2\subdir3
  // => subdir1\subdir2\subdir3\file.txt
  // ...
});
```

Get `fs.Stats` objects instead of strings <a id="stats"></a>
------------------------
All of the `readdir-enhanced` functions listed above return an array of strings (paths). But in some situations, the path isn't enough information.  So, `readdir-enhanced` provides alternative versions of each function, which return an array of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) objects instead of strings.  The `fs.Stats` object contains all sorts of useful information, such the size, the creation date/time, and helper methods such as `isFile()`, `isDirectory()`, `isSymbolicLink()`, etc.

> **NOTE:** The [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) objects that are returned also have an additional `path` property. The `path` is relative to the directory by default, but you can customize this via [`options.basePath`](#basepath).

To get `fs.Stats` objects instead of strings, just call add the word "Stat" to the function name.  As with the normal functions, each one is aliased, so you can use whichever naming style you prefer.

```javascript
var readdir = require('readdir-enhanced');

// Synchronous API
var stats = readdir.sync.stat('my/directory');
var stats = readdir.readdirSyncStat('my/directory');

// Async API
readdir.async.stat('my/directory', function(err, stats) { ... });
readdir.readdirAsyncStat('my/directory', function(err, stats) { ... });

// Streaming API
readdir.stream.stat('my/directory')
  .on('data', function(stat) { ... })
  .on('file', function(stat) { ... })
  .on('directory', function(stat) { ... })
  .on('symlink', function(stat) { ... });

readdir.readdirStreamStat('my/directory')
  .on('data', function(stat) { ... })
  .on('file', function(stat) { ... })
  .on('directory', function(stat) { ... })
  .on('symlink', function(stat) { ... });

```


Backward Compatible <a id="backward-compatible"></a>
--------------------
`readdir-enhanced` is fully backward-compatible with Node.js' built-in `fs.readdir()` and `fs.readdirSync()` functions, so you can use it as a drop-in replacement in existing projects without affecting existing functionality, while still being able to use the enhanced features as needed.

```javascript
var readdir = require('readdir-enhanced');
var readdirSync = readdir.sync;

// Use it just like Node's built-in fs.readdir function
readdir('my/directory', function(err, files) { ... });

// Use it just like Node's built-in fs.readdirSync function
var files = readdirSync('my/directory');
```
