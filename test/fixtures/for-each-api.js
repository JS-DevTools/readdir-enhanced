'use strict';

var readdir = require('../../');

module.exports = forEachApi;

/**
 * Runs an array of tests tests against each of the readdir-enhanced APIs
 */
function forEachApi(tests) {
  describe('Synchronous API', function() {
    tests.forEach(function(test) {
      testApi(test, function(done) {
        try {
          var data = readdir.sync.apply(null, test.args);
          done(null, data);
        }
        catch (error) {
          done(error);
        }
      });
    });
  });

  describe('Asynchronous API (callback/Promise)', function() {
    tests.forEach(function(test) {
      testApi(test, function(done) {
        readdir.async.apply(null, test.args)
          .then(
            function(data) {
              done(null, data);
            },
            function(error) {
              done(error);
            }
          );
      });
    });
  });

  describe('Asynchronous API (Stream/EventEmitter)', function() {
    tests.forEach(function(test) {
      testApi(test, function(done) {
        try {
          var stream = readdir.stream.apply(null, test.args);
        }
        catch (error) {
          return done(error);
        }

        var errors = [], data = [], files = [], dirs = [], symlinks = [];
        stream.on('error', function(error) {
          errors.push(error);
        });
        stream.on('file', function(file) {
          files.push(file);
        });
        stream.on('directory', function(dir) {
          dirs.push(dir);
        });
        stream.on('symlink', function(symlink) {
          symlinks.push(symlink);
        });
        stream.on('data', function(datum) {
          data.push(datum);
        });
        stream.on('end', function() {
          done(errors, data, files, dirs, symlinks);
        });
      });
    });
  });
}

/**
 * Runs a single test against a single readdir-enhanced API.
 *
 * @param {object} test - An object containing test info, parameters, and assertions
 * @param {function} api - A function that calls the readdir-enhanced API and returns its results
 */
function testApi(test, api) {
  if (test.only) {
    // Only run this one test (useful for debugging)
    it.only(test.it, runTest);
  }
  else if (test.skip) {
    // Skip this test (useful for temporarily disabling a failing test)
    it.skip(test.it, runTest);
  }
  else {
    // Run this test normally
    it(test.it, runTest);
  }

  function runTest(done) {
    // Call the readdir-enhanced API and get the results
    api(function(errors, data, files, dirs, symlinks) {
      try {
        var isStreamingApi = files || dirs || symlinks;
        if (isStreamingApi) {
          // Perform assertions that are specific to the streaming API
          if (test.streamAssert) {
            test.streamAssert(errors, data, files, dirs, symlinks);
          }

          // Modify the results to match the sync/callback/promise API results
          if (errors.length === 0) {
            errors = null;
          }
          else {
            errors = errors[0];
            data = undefined;
          }
        }

        // Perform assertions that are common to ALL of the APIs (including streaming)
        test.assert(errors, data);

        done();
      }
      catch (e) {
        // An assertion failed, so fail the test
        done(e);
      }
    });
  }
}
