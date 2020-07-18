Enhanced `fs.readdir()`
=======================

[![Cross-Platform Compatibility](https://jstools.dev/img/badges/os-badges.svg)](https://github.com/JS-DevTools/readdir-enhanced/actions)
[![Build Status](https://github.com/JS-DevTools/readdir-enhanced/workflows/CI-CD/badge.svg)](https://github.com/JS-DevTools/readdir-enhanced/actions)

[![Coverage Status](https://coveralls.io/repos/github/JS-DevTools/readdir-enhanced/badge.svg?branch=master)](https://coveralls.io/github/JS-DevTools/readdir-enhanced?branch=master)
[![Dependencies](https://david-dm.org/JS-DevTools/readdir-enhanced.svg)](https://david-dm.org/JS-DevTools/readdir-enhanced)

[![npm](https://img.shields.io/npm/v/@jsdevtools/readdir-enhanced.svg)](https://www.npmjs.com/package/@jsdevtools/readdir-enhanced)
[![License](https://img.shields.io/npm/l/@jsdevtools/readdir-enhanced.svg)](LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/JS-DevTools/readdir-enhanced)



Features
----------------------------------
- Fully [**backward-compatible**](#backward-compatible) drop-in replacement for [`fs.readdir()`](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback) and [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options)

- Can [crawl sub-directories](#deep) - you can even control which ones

- Supports [filtering results](#filter) using globs, regular expressions, or custom logic

- Can return [absolute paths](#basepath)

- Can return [`fs.Stats` objects](#stats) rather than just paths

- Exposes additional APIs: [Promise, Stream, EventEmitter, and Async Iterator](#pick-your-api).



Example
----------------------------------

```javascript
import readdir from "@jsdevtools/readdir-enhanced";
import through2 from "through2";

// Synchronous API
let files = readdir.sync("my/directory");

// Callback API
readdir.async("my/directory", (err, files) => { ... });

// Promises API
readdir.async("my/directory")
  .then((files) => { ... })
  .catch((err) => { ... });

// Async/Await API
let files = await readdir.async("my/directory");

// Async Iterator API
for await (let item of readdir.iterator("my/directory")) {
  ...
}

// EventEmitter API
readdir.stream("my/directory")
  .on("data", (path) => { ... })
  .on("file", (path) => { ... })
  .on("directory", (path) => { ... })
  .on("symlink", (path) => { ... })
  .on("error", (err) => { ... });

// Streaming API
let stream = readdir.stream("my/directory")
  .pipe(through2.obj(function(data, enc, next) {
    console.log(data);
    this.push(data);
    next();
  });
```



Pick Your API
----------------------------------
Readdir Enhanced has multiple APIs, so you can pick whichever one you prefer. Here are some things to consider about each API:

|Function|Returns|Syntax|[Blocks the thread?](#blocking-the-thread)|[Buffers results?](#buffered-results)|
|---|---|---|---|---|
|`readdirSync()`<br>`readdir.sync()`|Array|Synchronous|yes|yes|
|`readdir()`<br>`readdir.async()`<br>`readdirAsync()`|[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)|[`async/await`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)<br>[`Promise.then()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)<br>[callback](https://nodejs.org/en/knowledge/getting-started/control-flow/what-are-callbacks/)|no|yes|
|`readdir.iterator()`<br>`readdirIterator()`|[Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)|[`for await...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)|no|no|
|`readdir.stream()`<br>`readdirStream()`|[Readable Stream](https://nodejs.org/api/stream.html#stream_readable_streams)|[`stream.on("data")`](https://nodejs.org/api/stream.html#stream_event_data)<br>[`stream.read()`](https://nodejs.org/api/stream.html#stream_readable_read_size)<br>[`stream.pipe()`](https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options)|no|no|

### Blocking the Thread
The synchronous API blocks the thread until all results have been read. Only use this if you know the directory does not contain many items, or if your program needs the results before it can do anything else.

### Buffered Results
Some APIs buffer the results, which means you get all the results at once (as an array). This can be more convenient to work with, but it can also consume a significant amount of memory, depending on how many results there are. The non-buffered APIs return each result to you one-by-one, which means you can start processing the results even while the directory is still being read.



Alias Exports
----------------------------------
The [example above](#example) imported the `readdir` default export and used its properties, such as `readdir.sync` or `readdir.async` to call specific APIs. For convenience, each of the different APIs is exported as a named function that you can import directly.

- `readdir.sync()` is also exported as `readdirSync()`
- `readdir.async()` is also exported as `readdirAsync()`
- `readdir.iterator()` is also exported as `readdirIterator()`
- `readdir.stream()` is also exported as `readdirStream()`

Here's how to import named exports rather than the default export:

```javascript
import { readdirSync, readdirAsync, readdirIterator, readdirStream } from "@jsdevtools/readdir-enhanced";
```



<a id="options"></a>
Enhanced Features
----------------------------------
Readdir Enhanced adds several features to the built-in `fs.readdir()` function.  All of the enhanced features are opt-in, which makes Readdir Enhanced [fully backward compatible by default](#backward-compatible).  You can enable any of the features by passing-in an `options` argument as the second parameter.



<a id="deep"></a>
Crawl Subdirectories
----------------------------------
By default, Readdir Enhanced will only return the top-level contents of the starting directory. But you can set the `deep` option to recursively traverse the subdirectories and return their contents as well.

### Crawl ALL subdirectories

The `deep` option can be set to `true` to traverse the entire directory structure.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

readdir("my/directory", {deep: true}, (err, files) => {
  console.log(files);
  // => subdir1
  // => subdir1/file.txt
  // => subdir1/subdir2
  // => subdir1/subdir2/file.txt
  // => subdir1/subdir2/subdir3
  // => subdir1/subdir2/subdir3/file.txt
});
```

### Crawl to a specific depth
The `deep` option can be set to a number to only traverse that many levels deep.  For example, calling `readdir("my/directory", {deep: 2})` will return `subdir1/file.txt` and `subdir1/subdir2/file.txt`, but it _won't_ return `subdir1/subdir2/subdir3/file.txt`.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

readdir("my/directory", {deep: 2}, (err, files) => {
  console.log(files);
  // => subdir1
  // => subdir1/file.txt
  // => subdir1/subdir2
  // => subdir1/subdir2/file.txt
  // => subdir1/subdir2/subdir3
});
```

### Crawl subdirectories by name
For simple use-cases, you can use a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) or a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) to crawl only the directories whose path matches the pattern.  The path is relative to the starting directory by default, but you can customize this via [`options.basePath`](#basepath).

> **NOTE:** Glob patterns [_always_ use forward-slashes](https://github.com/isaacs/node-glob#windows), even on Windows. This _does not_ apply to regular expressions though. Regular expressions should use the appropraite path separator for the environment. Or, you can match both types of separators using `[\\/]`.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

// Only crawl the "lib" and "bin" subdirectories
// (notice that the "node_modules" subdirectory does NOT get crawled)
readdir("my/directory", {deep: /lib|bin/}, (err, files) => {
  console.log(files);
  // => bin
  // => bin/cli.js
  // => lib
  // => lib/index.js
  // => node_modules
  // => package.json
});
```

### Custom recursion logic
For more advanced recursion, you can set the `deep` option to a function that accepts an [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object and returns a truthy value if the starting directory should be crawled.

> **NOTE:** The [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object that's passed to the function has additional `path` and `depth` properties. The `path` is relative to the starting directory by default, but you can customize this via [`options.basePath`](#basepath). The `depth` is the number of subdirectories beneath the base path (see [`options.deep`](#deep)).

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

// Crawl all subdirectories, except "node_modules"
function ignoreNodeModules (stats) {
  return stats.path.indexOf("node_modules") === -1;
}

readdir("my/directory", {deep: ignoreNodeModules}, (err, files) => {
  console.log(files);
  // => bin
  // => bin/cli.js
  // => lib
  // => lib/index.js
  // => node_modules
  // => package.json
});
```



<a id="filter"></a>
Filtering
----------------------------------
The `filter` option lets you limit the results based on any criteria you want.

### Filter by name
For simple use-cases, you can use a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) or a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) to filter items by their path.  The path is relative to the starting directory by default, but you can customize this via [`options.basePath`](#basepath).

> **NOTE:** Glob patterns [_always_ use forward-slashes](https://github.com/isaacs/node-glob#windows), even on Windows. This _does not_ apply to regular expressions though. Regular expressions should use the appropraite path separator for the environment. Or, you can match both types of separators using `[\\/]`.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

// Find all .txt files
readdir("my/directory", {filter: "*.txt"});

// Find all package.json files
readdir("my/directory", {filter: "**/package.json", deep: true});

// Find everything with at least one number in the name
readdir("my/directory", {filter: /\d+/});
```

### Custom filtering logic
For more advanced filtering, you can specify a filter function that accepts an [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object and returns a truthy value if the item should be included in the results.

> **NOTE:** The [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object that's passed to the filter function has additional `path` and `depth` properties. The `path` is relative to the starting directory by default, but you can customize this via [`options.basePath`](#basepath). The `depth` is the number of subdirectories beneath the base path (see [`options.deep`](#deep)).

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

// Only return file names containing an underscore
function myFilter(stats) {
  return stats.isFile() && stats.path.indexOf("_") >= 0;
}

readdir("my/directory", {filter: myFilter}, (err, files) => {
  console.log(files);
  // => __myFile.txt
  // => my_other_file.txt
  // => img_1.jpg
  // => node_modules
});
```



<a id="stats"></a>
Get `fs.Stats` objects instead of strings
------------------------------------------------------------
All of the Readdir Enhanced functions listed above return an array of strings (paths). But in some situations, the path isn't enough information.  Setting the `stats` option returns an array of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) objects instead of path strings.  The `fs.Stats` object contains all sorts of useful information, such as the size, the creation date/time, and helper methods such as `isFile()`, `isDirectory()`, `isSymbolicLink()`, etc.

> **NOTE:** The [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) objects that are returned also have additional `path` and `depth` properties. The `path` is relative to the starting directory by default, but you can customize this via [`options.basePath`](#basepath). The `depth` is the number of subdirectories beneath the base path (see [`options.deep`](#deep)).

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

readdir("my/directory", { stats: true }, (err, stats) => {
  for (let stat of stats) {
    console.log(`${stat.path} was created at ${stat.birthtime}`);
  }
});
```



<a id="basepath"></a>
Base Path
----------------------------------
By default all Readdir Enhanced functions return paths that are relative to the starting directory. But you can use the `basePath` option to customize this.  The `basePath` will be prepended to all of the returned paths.  One common use-case for this is to set `basePath` to the absolute path of the starting directory, so that all of the returned paths will be absolute.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";
import { resolve } from "path";

// Get absolute paths
let absPath = resolve("my/dir");
readdir("my/directory", {basePath: absPath}, (err, files) => {
  console.log(files);
  // => /absolute/path/to/my/directory/file1.txt
  // => /absolute/path/to/my/directory/file2.txt
  // => /absolute/path/to/my/directory/subdir
});

// Get paths relative to the working directory
readdir("my/directory", {basePath: "my/directory"}, (err, files) => {
  console.log(files);
  // => my/directory/file1.txt
  // => my/directory/file2.txt
  // => my/directory/subdir
});
```



<a id="sep"></a>
Path Separator
----------------------------------
By default, Readdir Enhanced uses the correct path separator for your OS (`\` on Windows, `/` on Linux & MacOS). But you can set the `sep` option to any separator character(s) that you want to use instead.  This is usually used to ensure consistent path separators across different OSes.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

// Always use Windows path separators
readdir("my/directory", {sep: "\\", deep: true}, (err, files) => {
  console.log(files);
  // => subdir1
  // => subdir1\file.txt
  // => subdir1\subdir2
  // => subdir1\subdir2\file.txt
  // => subdir1\subdir2\subdir3
  // => subdir1\subdir2\subdir3\file.txt
});
```



<a id="fs"></a>
Custom FS methods
----------------------------------
By default, Readdir Enhanced uses the default [Node.js FileSystem module](https://nodejs.org/api/fs.html) for methods like `fs.stat`, `fs.readdir` and `fs.lstat`. But in some situations, you can want to use your own FS methods (FTP, SSH, remote drive and etc). So you can provide your own implementation of FS methods by setting `options.fs` or specific methods, such as `options.fs.stat`.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

function myCustomReaddirMethod(dir, callback) {
  callback(null, ["__myFile.txt"]);
}

let options = {
  fs: {
    readdir: myCustomReaddirMethod
  }
};

readdir("my/directory", options, (err, files) => {
  console.log(files);
  // => __myFile.txt
});
```



<a id="backward-compatible"></a>
Backward Compatible
-------------------------------------
Readdir Enhanced is fully backward-compatible with Node.js' built-in `fs.readdir()` and `fs.readdirSync()` functions, so you can use it as a drop-in replacement in existing projects without affecting existing functionality, while still being able to use the enhanced features as needed.

```javascript
import { readdir, readdirSync } from "@jsdevtools/readdir-enhanced";

// Use it just like Node's built-in fs.readdir function
readdir("my/directory", (er,  files) => { ... });

// Use it just like Node's built-in fs.readdirSync function
let files = readdirSync("my/directory");
```



A Note on Streams
----------------------------------
The Readdir Enhanced streaming API follows the Node.js streaming API. A lot of questions around the streaming API can be answered by reading the [Node.js documentation.](https://nodejs.org/api/stream.html). However, we've tried to answer the most common questions here.

### Stream Events

All events in the Node.js streaming API are supported by Readdir Enhanced. These events include "end", "close", "drain", "error", plus more. [An exhaustive list of events is available in the Node.js documentation.](https://nodejs.org/api/stream.html#stream_class_stream_readable)

#### Detect when the Stream has finished

Using these events, we can detect when the stream has finished reading files.

```javascript
import readdir from "@jsdevtools/readdir-enhanced";

// Build the stream using the Streaming API
let stream = readdir.stream("my/directory")
  .on("data", (path) => { ... });

// Listen to the end event to detect the end of the stream
stream.on("end", () => {
  console.log("Stream finished!");
});
```

### Paused Streams vs. Flowing Streams

As with all Node.js streams, a Readdir Enhanced stream starts in "paused mode". For the stream to start emitting files, you'll need to switch it to "flowing mode".

There are many ways to trigger flowing mode, such as adding a `stream.data()` handler, using `stream.pipe()` or calling `stream.resume()`.

Unless you trigger flowing mode, your stream will stay paused and you won't receive any file events.

[More information on paused vs. flowing mode can be found in the Node.js documentation.](https://nodejs.org/api/stream.html#stream_two_reading_modes)



Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome!  [Open an issue](https://github.com/JS-DevTools/readdir-enhanced/issues) on GitHub and [submit a pull request](https://github.com/JS-DevTools/readdir-enhanced/pulls).

#### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/JS-DevTools/readdir-enhanced.git`

2. __Install dependencies__<br>
`npm install`

3. __Run the tests__<br>
`npm test`



License
--------------------------
Readdir Enhanced is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.

This package is [Treeware](http://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/JS-DevTools/readdir-enhanced) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jstools.dev/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jstools.dev/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jstools.dev/img/badges/coveralls.svg)](https://coveralls.io)
