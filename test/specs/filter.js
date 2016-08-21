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
      only: true,
      it: 'should return filtered deep contents',
      args: ['test/dir', {
        deep: true,
        filter: function(stats) {
          return stats.path.indexOf('empty') >= 0;
        }
      }],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(['empty', 'empty.txt', 'subdir/subsubdir/empty.txt']);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(['empty', 'empty.txt', 'subdir/subsubdir/empty.txt']);
        expect(files).to.have.same.members(['empty.txt', 'subdir/subsubdir/empty.txt']);
        expect(dirs).to.have.same.members(['empty']);
        expect(symlinks).to.have.lengthOf(0);
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
