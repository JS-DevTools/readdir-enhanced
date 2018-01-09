'use strict';

var forEachApi = require('../fixtures/for-each-api');
var dir = require('../fixtures/dir');
var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;

describe('options.fs', function () {
  forEachApi([
    {
      it: 'should have no effect if `options.fs` is null',
      args: ['test/dir', { fs: null }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should have no effect if `options.fs` is empty',
      args: ['test/dir', { fs: {}}],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },


    /************************************************************
     * fs.readdir
     ************************************************************/
    {
      it: 'should use a custom `fs.readdir` method',
      args: ['test/dir', {
        fs: {
          readdir: function (dirPath, callback) {
            callback(null, dir.txt.shallow.data);
          },
        }
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.txt.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.txt.shallow.data);
        expect(files).to.have.same.members(dir.txt.shallow.files);
        expect(dirs).to.have.same.members(dir.txt.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.txt.shallow.symlinks);
      },
    },
    {
      it: 'should handle an invalid file name from a custom `fs.readdir` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          readdir: function (dirPath, callback) {
            callback(null, ['empty.txt', 'invalid.txt', 'file.txt']);
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(1);
        expect(errors[0].code).to.equal('ENOENT');
        expect(data).to.have.same.members(['empty.txt', 'file.txt']);
        expect(files).to.have.same.members(['empty.txt', 'file.txt']);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: 'should handle a null result from a custom `fs.readdir` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          readdir: function (dirPath, callback) {
            callback(null, null);
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.match(/Cannot read property '\w+' of null/);
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(1);
        expect(errors[0].message).to.match(/Cannot read property '\w+' of null/);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: 'should handle an invalid result from a custom `fs.readdir` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          readdir: function (dirPath, callback) {
            callback(null, 12345);
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('array.forEach is not a function');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(1);
        expect(errors[0].message).to.equal('array.forEach is not a function');
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: 'should handle an error from a custom `fs.readdir` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          readdir: function (dirPath, callback) {
            // Simulate a sporadic error
            if (dirPath === 'test/dir/subdir/subsubdir') {
              callback(new Error('Boooooom!'));
            }
            else {
              var files = fs.readdirSync(dirPath);
              callback(null, files);
            }
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Boooooom!');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.same.members(this.omitSubdir(dir.deep.data));
        expect(files).to.have.same.members(this.omitSubdir(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSubdir(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSubdir(dir.deep.symlinks));
      },

      // Omits the contents of the "subsubdir" directory
      omitSubdir: function (paths) {
        return paths.filter(function (p) {
          return p.substr(7, 10) !== 'subsubdir' + path.sep;
        });
      }
    },
    {
      it: 'should handle an error thrown by a custom `fs.readdir` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          readdir: function (dirPath, callback) {
            // Simulate an error being thrown (rather than returned to the callback)
            if (dirPath === 'test/dir/subdir/subsubdir') {
              throw new Error('Boooooom!');
            }
            else {
              var files = fs.readdirSync(dirPath);
              callback(null, files);
            }
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Boooooom!');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.same.members(this.omitSubdir(dir.deep.data));
        expect(files).to.have.same.members(this.omitSubdir(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSubdir(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSubdir(dir.deep.symlinks));
      },

      // Omits the contents of the "subsubdir" directory
      omitSubdir: function (paths) {
        return paths.filter(function (p) {
          return p.substr(7, 10) !== 'subsubdir' + path.sep;
        });
      }
    },


    /************************************************************
     * fs.stat
     ************************************************************/
    {
      it: 'should use a custom `fs.stat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          stat: function (dirPath, callback) {
            callback(null, {
              isFile: function () { return true; },
              isDirectory: function () { return false; },
              isSymbolicLink: function () { return false; },
            });
          },
        }
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(this.omitSymlinkDirs(dir.deep.data));
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(this.omitSymlinkDirs(dir.deep.data));
        expect(files).to.have.same.members(
          Array.from(new Set(
            this.omitSymlinkDirs(dir.deep.files)
            .concat(this.omitSymlinkDirs(dir.deep.symlinks))))
        );
        expect(dirs).to.have.same.members(this.omitSymlinks(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSymlinkDirs(dir.deep.symlinks));
      },

      // Omits symlink directories
      omitSymlinks: function (files) {
        return files.filter(file => !file.includes('symlink'));
      },

      // Omits symlink directories
      omitSymlinkDirs: function (files) {
        return files.filter(file => !file.includes('symlink/'));
      },
    },
    {
      it: 'should handle a null result from a custom `fs.stat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          stat: function (dirPath, callback) {
            callback(null, null);
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.match(/Cannot \w+ property 'isSymbolicLink' of null/);
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(7);
        expect(errors[0].message).to.match(/Cannot \w+ property 'isSymbolicLink' of null/);
        expect(data).to.have.same.members(this.omitSymlinks(dir.deep.data));
        expect(files).to.have.same.members(this.omitSymlinks(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSymlinks(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSymlinks(dir.deep.symlinks));
      },

      // Omits symlinks
      omitSymlinks: function (files) {
        return files.filter(file => !file.includes('symlink'));
      }
    },
    {
      it: 'should handle an invalid result from a custom `fs.stat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          stat: function (dirPath, callback) {
            callback(null, 'Hello, world');
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.match(/Cannot create property 'isSymbolicLink' on string/);
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(7);
        expect(errors[0].message).to.match(/Cannot create property 'isSymbolicLink' on string/);
        expect(data).to.have.same.members(this.omitSymlinks(dir.deep.data));
        expect(files).to.have.same.members(this.omitSymlinks(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSymlinks(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSymlinks(dir.deep.symlinks));
      },

      // Omits symlinks
      omitSymlinks: function (files) {
        return files.filter(file => !file.includes('symlink'));
      }
    },
    {
      it: 'should handle an error from a custom `fs.stat` method',
      args: ['test/dir', {
        fs: {
          stat: function (filePath, callback) {
            // Simulate a sporadic error
            if (filePath === 'test/dir/subsubdir-symlink') {
              callback(new Error('Boooooom!'));
            }
            else {
              var stats = fs.statSync(filePath);
              callback(null, stats);
            }
          },
        }
      }],
      assert: function (error, data) {
        // An error in fs.stat is handled internally, so no error is thrown
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(
          dir.shallow.dirs.filter(file => file !== 'subsubdir-symlink')
        );
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should handle an error thrown by a custom `fs.stat` method',
      args: ['test/dir', {
        fs: {
          stat: function (filePath, callback) {
            // Simulate an error being thrown (rather than returned to the callback)
            if (filePath === 'test/dir/subsubdir-symlink') {
              throw new Error('Boooooom!');
            }
            else {
              var stats = fs.statSync(filePath);
              callback(null, stats);
            }
          },
        }
      }],
      assert: function (error, data) {
        // An error in fs.stat is handled internally, so no error is thrown
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(
          dir.shallow.dirs.filter(file => file !== 'subsubdir-symlink')
        );
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },


    /************************************************************
     * fs.lstat
     ************************************************************/
    {
      it: 'should use a custom `fs.lstat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          lstat: function (dirPath, callback) {
            callback(null, {
              isFile: function () { return true; },
              isDirectory: function () { return false; },
              isSymbolicLink: function () { return false; },
            });
          },
        }
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.data);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: 'should handle a null result from a custom `fs.lstat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          lstat: function (dirPath, callback) {
            callback(null, null);
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.match(/Cannot \w+ property 'isSymbolicLink' of null/);
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(12);
        expect(errors[0].message).to.match(/Cannot \w+ property 'isSymbolicLink' of null/);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: 'should handle an invalid result from a custom `fs.lstat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          lstat: function (dirPath, callback) {
            callback(null, 'Hello, world');
          },
        }
      }],
      assert: function (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.match(/lstats.isSymbolicLink is not a function/);
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(12);
        expect(errors[0].message).to.match(/lstats.isSymbolicLink is not a function/);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: 'should handle an error from a custom `fs.lstat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          lstat: function (filePath, callback) {
            // Simulate a sporadic error
            if (filePath === 'test/dir/subsubdir-symlink') {
              callback(new Error('Boooooom!'));
            }
            else {
              var lstats = fs.lstatSync(filePath);
              callback(null, lstats);
            }
          },
        }
      }],
      assert: function (error, data) {
        // An error in fs.lstat is handled internally, so no error is thrown
        expect(error).to.be.an.instanceOf(Error);
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.same.members(this.omitSubdirSymlink(dir.deep.data));
        expect(files).to.have.same.members(this.omitSubdirSymlink(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSubdirSymlink(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSubdirSymlink(dir.deep.symlinks));
      },

      // Omits the "subsubdir-symlink" directory and its children
      omitSubdirSymlink: function (files) {
        return files.filter(file => !file.includes('subsubdir-symlink'));
      }
    },
    {
      it: 'should handle an error thrown by a custom `fs.lstat` method',
      args: ['test/dir', {
        deep: true,
        fs: {
          lstat: function (filePath, callback) {
            // Simulate an error being thrown (rather than returned to the callback)
            if (filePath === 'test/dir/subsubdir-symlink') {
              throw new Error('Boooooom!');
            }
            else {
              var lstats = fs.lstatSync(filePath);
              callback(null, lstats);
            }
          },
        }
      }],
      assert: function (error, data) {
        // An error in fs.lstat is handled internally, so no error is thrown
        expect(error).to.be.an.instanceOf(Error);
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.same.members(this.omitSubdirSymlink(dir.deep.data));
        expect(files).to.have.same.members(this.omitSubdirSymlink(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSubdirSymlink(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSubdirSymlink(dir.deep.symlinks));
      },

      // Omits the "subsubdir-symlink" directory and its children
      omitSubdirSymlink: function (files) {
        return files.filter(file => !file.includes('subsubdir-symlink'));
      }
    },
  ]);
});
