describe('options.filter', function() {
  'use strict';

  var forEachApi = require('../fixtures/for-each-api');
  var dir = require('../fixtures/dir');
  var expect = require('chai').expect;

  forEachApi([
    {
      it: 'should return filtered top-level contents',
      args: ['test/dir', {
        filter: function(stats) {
          return stats.path.indexOf('empty') >= 0;
        }
      }],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(['empty', 'empty.txt']);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(['empty', 'empty.txt']);
        expect(files).to.have.same.members(['empty.txt']);
        expect(dirs).to.have.same.members(['empty']);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: 'should return filtered deep contents',
      args: ['test/dir', {
        deep: true,
        filter: function(stats) {
          return stats.path.indexOf('empty') >= 0;
        }
      }],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.empties.deep.data);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.empties.deep.data);
        expect(files).to.have.same.members(dir.empties.deep.files);
        expect(dirs).to.have.same.members(dir.empties.deep.dirs);
        expect(symlinks).to.have.same.members(dir.empties.deep.symlinks);
      },
    },
    {
      it: 'should filter by files',
      args: ['test/dir', {
        deep: true,
        filter: function(stats) {
          return stats.isFile();
        }
      }],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.files);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.files);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.same.members(dir.symlinks.deep.files);
      },
    },
    {
      it: 'should filter by directories',
      args: ['test/dir', {
        deep: true,
        filter: function(stats) {
          return stats.isDirectory();
        }
      }],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.dirs);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.dirs);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.symlinks.deep.dirs);
      },
    },
    {
      it: 'should filter by symlinks',
      args: ['test/dir', {
        deep: true,
        filter: function(stats) {
          return stats.isSymbolicLink();
        }
      }],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.symlinks);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.symlinks);
        expect(files).to.have.same.members(dir.symlinks.deep.files);
        expect(dirs).to.have.same.members(dir.symlinks.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: 'should handle errors that occur in the filter function',
      args: ['test/dir', {
        filter: function(stats) {
          if (stats.isSymbolicLink()) {
            throw new Error('Boooooom!');
          }
          return true;
        }
      }],
      assert: function(error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Boooooom!');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors.length).to.equal(5);
        expect(data).to.have.same.members([
          '.dotdir', 'empty', 'subdir', '.dotfile', 'empty.txt', 'file.txt', 'file.json',
        ]);
        expect(files).to.have.same.members([
          '.dotfile', 'empty.txt', 'file.txt', 'file.json',
        ]);
        expect(dirs).to.have.same.members([
          '.dotdir', 'empty', 'subdir',
        ]);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
  ]);
});
