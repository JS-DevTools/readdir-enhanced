describe('error handling', function() {
  'use strict';

  var readdir = require('../../');
  var dir = require('../fixtures/dir');
  var forEachApi = require('../fixtures/for-each-api');
  var expect = require('chai').expect;

  forEachApi([
    {
      it: 'should throw an error if no arguments are passed',
      args: [],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.contain('path must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the path is not a string',
      args: [55555],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.contain('path must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options are invalid',
      args: ['test/dir', 'invalid options'],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options must be an object');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is invalid',
      args: ['test/dir', {deep: 'very deep'}],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options.deep must be a boolean or number');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is negative',
      args: ['test/dir', {deep: -5}],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('options.deep must be a positive number');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is NaN',
      args: ['test/dir', {deep: NaN}],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('options.deep must be a positive number');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is not an integer',
      args: ['test/dir', {deep: 5.4}],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('options.deep must be an integer');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.filter is invalid',
      args: ['test/dir', {filter: 'my filter'}],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options.filter must be a function');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.sep is invalid',
      args: ['test/dir', {sep: 57}],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options.sep must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.basePath is invalid',
      args: ['test/dir', {basePath: 57}],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options.basePath must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the directory does not exist',
      args: ['test/dir/does-not-exist'],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the path is not a directory',
      args: ['test/dir/file.txt'],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOTDIR');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the path is a broken symlink',
      args: ['test/dir/broken-dir-symlink'],
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
  ]);

  describe('Stream API', function() {
    it('should handle errors that occur in the "data" event listener', function(done) {
      testErrorHandling('data', dir.shallow.data, 7, done);
    });

    it('should handle errors that occur in the "file" event listener', function(done) {
      testErrorHandling('file', dir.shallow.files, 3, done);
    });

    it('should handle errors that occur in the "directory" event listener', function(done) {
      testErrorHandling('directory', dir.shallow.dirs, 2, done);
    });

    it('should handle errors that occur in the "symlink" event listener', function(done) {
      testErrorHandling('symlink', dir.shallow.symlinks, 5, done);
    });

    function testErrorHandling(eventName, expected, expectedErrors, done) {
      var errors = [], data = [];
      var stream = readdir.stream('test/dir');

      // Capture all errors
      stream.on('error', function(error) {
        errors.push(error);
      });

      stream.on(eventName, function(path) {
        data.push(path);

        if (path.indexOf('.txt') >= 0 || path.indexOf('dir-') >= 0) {
          throw new Error('Epic Fail!!!');
        }
        else {
          return true;
        }
      });

      stream.on('end', function() {
        try {
          // Make sure the correct number of errors were thrown
          expect(errors.length).to.equal(expectedErrors);
          errors.forEach(function(error) {
            expect(error.message).to.equal('Epic Fail!!!');
          });

          // All of the events should have still been emitted, despite the errors
          expect(data).to.have.same.members(expected);

          done();
        }
        catch (e) {
          done(e);
        }
      });

      stream.resume();
    }
  });
});
