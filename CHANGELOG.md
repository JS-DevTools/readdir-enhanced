# Change Log
All notable changes will be documented in this file.
`readdir-enhanced` adheres to [Semantic Versioning](http://semver.org/).


## [v1.4.0](https://github.com/BigstickCarpet/readdir-enhanced/tree/v1.4.0) (2016-08-26)

The [`filter` option](README.md#filter) can now be set to a regular expression or a glob pattern string, which simplifies filtering based on file names. Of course, you can still set the `filter` option to a function if you need to perform more advanced filtering based on the [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) of each file.

[Full Changelog](https://github.com/BigstickCarpet/readdir-enhanced/compare/v1.3.4...v1.4.0)


## [v1.3.4](https://github.com/BigstickCarpet/readdir-enhanced/tree/v1.3.4) (2016-08-26)

As of this release, `readdir-enhanced` is fully tested on all major Node versions (0.x, 4.x, 5.x, 6.x) on [linux](https://travis-ci.org/BigstickCarpet/readdir-enhanced) and [Windows](https://ci.appveyor.com/project/BigstickCarpet/readdir-enhanced/branch/master), with [nearly 100% code coverage](https://coveralls.io/github/BigstickCarpet/readdir-enhanced?branch=master).  I do all of my local development and testing on MacOS, so that's covered too.

[Full Changelog](https://github.com/BigstickCarpet/readdir-enhanced/compare/v1.0.1...v1.3.4)
