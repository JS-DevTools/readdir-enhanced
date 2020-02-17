Change Log
====================================================================================================
All notable changes will be documented in this file.
Readdir Enhanced adheres to [Semantic Versioning](http://semver.org/).


[v6.0.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v6.0.0) (2020-02-17)
----------------------------------------------------------------------------------------------------

- Moved Readdir Enhanced to the [@JSDevTools scope](https://www.npmjs.com/org/jsdevtools) on NPM

- The "readdir-enhanced" NPM package is now just a wrapper around the scoped "@jsdevtools/readdir-enhanced" package

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v5.1.1...v6.0.0)


[v5.1.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v5.1.0) (2019-11-07)
----------------------------------------------------------------------------------------------------

- The [`filter` option](README.md#filter) can now be set to a boolean to include/exclude everything.

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v5.0.1...v5.1.0)


[v5.0.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v5.0.0) (2019-11-03)
----------------------------------------------------------------------------------------------------

#### Breaking Changes

- Previously there were alternative versions of each function that returned [`fs.Stats` objects](https://nodejs.org/api/fs.html#fs_class_fs_stats) rather than path strings.  These functions have been replaced by [the `stats` option](README.md#stats).

#### Other Changes

- Completely rewritten in TypeScript

- Added an [async iterable interface](README.md#pick-your-api) so you can now crawl directories using convenient [`for await...of` syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of). This is faster and more efficient that the normal sync or async interfaces, since it doesn't require buffering all results in memory.


[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v4.0.3...v5.0.0)


[v4.0.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v4.0.0) (2019-08-19)
----------------------------------------------------------------------------------------------------
#### Breaking Changes

- Removed [code](https://github.com/JS-DevTools/readdir-enhanced/commit/a35044d3399697d47ff20aee6f59bb48c355986d) that was stripping the drive letters from Windows paths when using glob filters.

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v3.0.1...v4.0.0)


[v3.0.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v3.0.0) (2019-06-13)
----------------------------------------------------------------------------------------------------
#### Breaking Changes

- Dropped support for Node 6

- Updated all code to ES6+ syntax (async/await, template literals, arrow functions, etc.)

#### Other Changes

- Added [TypeScript definitions](lib/index.d.ts)

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v2.2.4...v3.0.0)


[v2.2.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v2.2.0) (2018-01-09)
----------------------------------------------------------------------------------------------------
- Refactored the codebase to use ES6 syntax (Node v4.x compatible)

- You can now provide [your own implementation](https://github.com/JS-DevTools/readdir-enhanced#custom-fs-methods) for the [filesystem module](https://nodejs.org/api/fs.html) that's used by `readdir-enhanced`.  Just set the `fs` option to your implementation.  Thanks to [@mrmlnc](https://github.com/mrmlnc) for the idea and [the PR](https://github.com/JS-DevTools/readdir-enhanced/pull/10)!

- [Better error handling](https://github.com/JS-DevTools/readdir-enhanced/commit/0d330b68524bafbdeae11566a3e8af1bc3f184bf), especially around user-specified logic, such as `options.deep`, `options.filter`, and `options.fs`

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v2.1.0...v2.2.0)


[v2.1.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v2.1.0) (2017-12-01)
----------------------------------------------------------------------------------------------------
- The `fs.Stats` objects now include a `depth` property, which indicates the number of subdirectories beneath the base path.  Thanks to [@mrmlnc](https://github.com/mrmlnc) for [the PR](https://github.com/JS-DevTools/readdir-enhanced/pull/8)!

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v2.0.0...v2.1.0)


[v2.0.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v2.0.0) (2017-11-15)
----------------------------------------------------------------------------------------------------
- Dropped support for Node v0.x, which is no longer actively maintained.  Please upgrade to Node 4 or newer.

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v1.5.0...v2.0.0)


[v1.5.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v1.5.0) (2017-04-10)
----------------------------------------------------------------------------------------------------
The [`deep` option](README.md#deep) can now be set to a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), a [glob pattern](https://github.com/isaacs/node-glob#glob-primer), or a function, which allows you to customize which subdirectories get crawled.  Of course, you can also still still set the `deep` option to `true` to crawl _all_ subdirectories, or a number if you just want to limit the recursion depth.

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v1.4.0...v1.5.0)


[v1.4.0](https://github.com/JS-DevTools/readdir-enhanced/tree/v1.4.0) (2016-08-26)
----------------------------------------------------------------------------------------------------
The [`filter` option](README.md#filter) can now be set to a regular expression or a glob pattern string, which simplifies filtering based on file names. Of course, you can still set the `filter` option to a function if you need to perform more advanced filtering based on the [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) of each file.

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v1.3.4...v1.4.0)


[v1.3.4](https://github.com/JS-DevTools/readdir-enhanced/tree/v1.3.4) (2016-08-26)
----------------------------------------------------------------------------------------------------
As of this release, `readdir-enhanced` is fully tested on all major Node versions (0.x, 4.x, 5.x, 6.x) on [linux](https://travis-ci.org/JS-DevTools/readdir-enhanced) and [Windows](https://ci.appveyor.com/project/JamesMessinger/readdir-enhanced/branch/master), with [nearly 100% code coverage](https://coveralls.io/github/JS-DevTools/readdir-enhanced?branch=master).  I do all of my local development and testing on MacOS, so that's covered too.

[Full Changelog](https://github.com/JS-DevTools/readdir-enhanced/compare/v1.0.1...v1.3.4)
