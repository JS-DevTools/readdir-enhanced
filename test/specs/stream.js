'use strict';

let readdir = require('../../');
let dir = require('../fixtures/dir');
let expect = require('chai').expect;
let through2 = require('through2');
let fs = require('fs');

let isNode10 = process.version.substr(0, 5) === 'v0.10';

describe('Stream API', function () {
  it('should be able to pipe to other streams as a Buffer', function (done) {
    let allData = [];

    readdir.stream('test/dir')
      .pipe(through2(function (data, enc, next) {
        try {
          // By default, the data is streamed as a Buffer
          expect(data).to.be.an.instanceOf(Buffer);

          // Buffer.toString() returns the file name
          allData.push(data.toString());

          next(null, data);
        }
        catch (e) {
          next(e);
        }
      }))
      .on('finish', function () {
        try {
          expect(allData).to.have.same.members(dir.shallow.data);
          done();
        }
        catch (e) {
          done(e);
        }
      })
      .on('error', function (err) {
        done(err);
      });
  });

  it('should be able to pipe to other streams in "object mode"', function (done) {
    let allData = [];

    readdir.stream('test/dir')
      .pipe(through2({ objectMode: true }, function (data, enc, next) {
        try {
          // In "object mode", the data is a string
          expect(data).to.be.a('string');

          allData.push(data);
          next(null, data);
        }
        catch (e) {
          next(e);
        }
      }))
      .on('finish', function () {
        try {
          expect(allData).to.have.same.members(dir.shallow.data);
          done();
        }
        catch (e) {
          done(e);
        }
      })
      .on('error', function (err) {
        done(err);
      });
  });

  it('should be able to pipe fs.Stats to other streams in "object mode"', function (done) {
    let allData = [];

    readdir.stream.stat('test/dir')
      .pipe(through2({ objectMode: true }, function (data, enc, next) {
        try {
          // The data is an fs.Stats object
          expect(data).to.be.an('object');
          expect(data).to.be.an.instanceOf(fs.Stats);

          allData.push(data.path);
          next(null, data);
        }
        catch (e) {
          next(e);
        }
      }))
      .on('finish', function () {
        try {
          expect(allData).to.have.same.members(dir.shallow.data);
          done();
        }
        catch (e) {
          done(e);
        }
      })
      .on('error', done);
  });

  it('should be able to pause & resume the stream', function (done) {
    let allData = [];

    let stream = readdir.stream('test/dir')
      .on('data', function (data) {
        allData.push(data);

        // stream.isPaused() doesn't exist in Node v0.10
        if (!isNode10) {
          // The stream should not be paused
          expect(stream.isPaused()).to.be.false;
        }

        if (allData.length === 3) {
          // Pause for one second
          stream.pause();
          setTimeout(function () {
            try {
              // stream.isPaused() doesn't exist in Node v0.10
              if (!isNode10) {
                // The stream should still be paused
                expect(stream.isPaused()).to.be.true;
              }

              // The array should still only contain 3 items
              expect(allData).to.have.lengthOf(3);

              // Read the rest of the stream
              stream.resume();
            }
            catch (e) {
              done(e);
            }
          }, 1000);
        }
      })
      .on('end', function () {
        expect(allData).to.have.same.members(dir.shallow.data);
        done();
      })
      .on('error', done);
  });

  it('should be able to use "readable" and "read"', function (done) {
    let allData = [];
    let nullCount = 0;

    let stream = readdir.stream('test/dir')
      .on('readable', function () {
        // Manually read the next chunk of data
        let data = stream.read();

        if (data === null) {
          // The stream is done
          nullCount++;
        }
        else {
          // The data should be a string (the file name)
          expect(data).to.be.a('string').and.not.empty;
          allData.push(data);
        }
      })
      .on('end', function () {
        if (isNode10) {
          // In Node v0.10, stream.read() always returns data
          expect(nullCount).to.equal(0);
        }
        else {
          // stream.read() should only return null once
          expect(nullCount).to.equal(1);
        }

        expect(allData).to.have.same.members(dir.shallow.data);
        done();
      })
      .on('error', done);
  });

  it('should be able to subscribe to custom events instead of "data"', function (done) {
    let allFiles = [];
    let allSubdirs = [];

    let stream = readdir.stream('test/dir');

    // Calling "resume" is required, since we're not handling the "data" event
    stream.resume();

    stream
      .on('file', function (filename) {
        expect(filename).to.be.a('string').and.not.empty;
        allFiles.push(filename);
      })
      .on('directory', function (subdir) {
        expect(subdir).to.be.a('string').and.not.empty;
        allSubdirs.push(subdir);
      })
      .on('end', function () {
        expect(allFiles).to.have.same.members(dir.shallow.files);
        expect(allSubdirs).to.have.same.members(dir.shallow.dirs);
        done();
      })
      .on('error', done);
  });

  it('should handle errors that occur in the "data" event listener', function (done) {
    testErrorHandling('data', dir.shallow.data, 7, done);
  });

  it('should handle errors that occur in the "file" event listener', function (done) {
    testErrorHandling('file', dir.shallow.files, 3, done);
  });

  it('should handle errors that occur in the "directory" event listener', function (done) {
    testErrorHandling('directory', dir.shallow.dirs, 2, done);
  });

  it('should handle errors that occur in the "symlink" event listener', function (done) {
    testErrorHandling('symlink', dir.shallow.symlinks, 5, done);
  });

  function testErrorHandling (eventName, expected, expectedErrors, done) {
    let errors = [], data = [];
    let stream = readdir.stream('test/dir');

    // Capture all errors
    stream.on('error', function (error) {
      errors.push(error);
    });

    stream.on(eventName, function (path) {
      data.push(path);

      if (path.indexOf('.txt') >= 0 || path.indexOf('dir-') >= 0) {
        throw new Error('Epic Fail!!!');
      }
      else {
        return true;
      }
    });

    stream.on('end', function () {
      try {
        // Make sure the correct number of errors were thrown
        expect(errors).to.have.lengthOf(expectedErrors);
        errors.forEach(function (error) {
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
