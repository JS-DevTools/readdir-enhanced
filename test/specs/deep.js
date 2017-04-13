'use strict';

var forEachApi = require('../fixtures/for-each-api');
var dir = require('../fixtures/dir');
var expect = require('chai').expect;
var path = require('path');

describe('options.deep', function () {
  forEachApi([
    {
      it: 'should return all deep contents',
      args: ['test/dir', { deep: true }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.data);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: 'should only return top-level contents if deep === false',
      args: ['test/dir', { deep: false }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should only return top-level contents if deep === 0',
      args: ['test/dir', { deep: 0 }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should return 1-level deep contents',
      args: ['test/dir', { deep: 1 }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.oneLevel.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.oneLevel.data);
        expect(files).to.have.same.members(dir.deep.oneLevel.files);
        expect(dirs).to.have.same.members(dir.deep.oneLevel.dirs);
        expect(symlinks).to.have.same.members(dir.deep.oneLevel.symlinks);
      },
    },
    {
      it: 'should return all deep contents if deep is a number greater than the number of dirs',
      args: ['test/dir', { deep: 25 }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.data);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: 'should return all deep contents if deep === Infinity',
      args: ['test/dir', { deep: Infinity }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.data);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: 'should recurse based on a regular expression',
      args: ['test/dir', {
        deep: /^((?!\-symlink).)*$/,
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(this.omitSymlinkDirs(dir.deep.data));
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(this.omitSymlinkDirs(dir.deep.data));
        expect(files).to.have.same.members(this.omitSymlinkDirs(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSymlinkDirs(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSymlinkDirs(dir.deep.symlinks));
      },

      // Omits the contents of the "-symlink" directories
      omitSymlinkDirs: function (paths) {
        return paths.filter(function (p) {
          return p.indexOf('-symlink' + path.sep) === -1;
        });
      }
    },
    {
      it: 'should recurse based on a glob pattern',
      args: ['test/dir', {
        deep: 'subdir',
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(this.shallowPlusSubdir('data'));
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(this.shallowPlusSubdir('data'));
        expect(files).to.have.same.members(this.shallowPlusSubdir('files'));
        expect(dirs).to.have.same.members(this.shallowPlusSubdir('dirs'));
        expect(symlinks).to.have.same.members(this.shallowPlusSubdir('symlinks'));
      },

      // Returns the shallow contents of the root directory and the "subdir" directory
      shallowPlusSubdir: function (type) {
        return dir.shallow[type].concat(
          dir.subdir.shallow[type].map(function (file) {
            return path.join('subdir', file);
          })
        );
      }
    },
    {
      it: 'should recurse based on a custom function',
      args: ['test/dir', {
        deep: function (stats) {
          return stats.path !== 'subdir';
        },
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(this.omitSubdir(dir.deep.data));
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(this.omitSubdir(dir.deep.data));
        expect(files).to.have.same.members(this.omitSubdir(dir.deep.files));
        expect(dirs).to.have.same.members(this.omitSubdir(dir.deep.dirs));
        expect(symlinks).to.have.same.members(this.omitSubdir(dir.deep.symlinks));
      },

      // Omits the contents of the "subdir" directory
      omitSubdir: function (paths) {
        return paths.filter(function (p) {
          return p.substr(0, 7) !== 'subdir' + path.sep;
        });
      }
    },
    {
      it: 'should return all deep contents if custom deep function always returns true',
      args: ['test/dir', {
        deep: function () {
          return true;
        },
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.data);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: 'should return shallow contents if custom deep function always returns false',
      args: ['test/dir', {
        deep: function () {
          return false;
        },
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should handle errors that occur in the deep function',
      args: ['test/dir', {
        deep: function (stats) {
          if (stats.isSymbolicLink()) {
            throw new Error('Boooooom!');
          }
          return false;
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
        expect(errors.length).to.equal(2);
        expect(data).to.have.same.members([
          '.dotdir', 'empty', 'subdir', '.dotfile', 'empty.txt', 'file.txt', 'file.json',
          'broken-dir-symlink', 'broken-symlink.txt', 'file-symlink.txt', 'subdir-symlink',
          'subsubdir-symlink'
        ]);
        expect(files).to.have.same.members([
          '.dotfile', 'empty.txt', 'file.txt', 'file.json', 'file-symlink.txt'
        ]);
        expect(dirs).to.have.same.members([
          '.dotdir', 'empty', 'subdir', 'subdir-symlink', 'subsubdir-symlink'
        ]);
        expect(symlinks).to.have.same.members([
          'broken-dir-symlink', 'broken-symlink.txt', 'file-symlink.txt', 'subdir-symlink',
          'subsubdir-symlink'
        ]);
      },
    },
  ]);
});
