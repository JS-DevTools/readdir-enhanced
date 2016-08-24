describe('Stream API', function() {
  'use strict';

  var readdir = require('../../');
  var dir = require('../fixtures/dir');
  var expect = require('chai').expect;

  it.skip('should be able to pipe to other streams', function() {
    throw new Error('not implemented yet');
  });

  it.skip('should be able to pause & resume the stream', function() {
    throw new Error('not implemented yet');
  });

  it.skip('should be able to subscribe to custom events instead of "data"', function() {
    throw new Error('not implemented yet');
  });

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