"use strict";

const readdir = require("../../");
const dir = require("../utils/dir");
const { expect } = require("chai");
const through2 = require("through2");
const fs = require("fs");

let nodeVersion = parseFloat(process.version.substr(1));

describe("Stream API", () => {
  it("should be able to pipe to other streams as a Buffer", done => {
    let allData = [];

    readdir.stream("test/dir")
      .pipe(through2((data, enc, next) => {
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
      .on("finish", () => {
        try {
          expect(allData).to.have.same.members(dir.shallow.data);
          done();
        }
        catch (e) {
          done(e);
        }
      })
      .on("error", err => {
        done(err);
      });
  });

  it('should be able to pipe to other streams in "object mode"', done => {
    let allData = [];

    readdir.stream("test/dir")
      .pipe(through2({ objectMode: true }, (data, enc, next) => {
        try {
          // In "object mode", the data is a string
          expect(data).to.be.a("string");

          allData.push(data);
          next(null, data);
        }
        catch (e) {
          next(e);
        }
      }))
      .on("finish", () => {
        try {
          expect(allData).to.have.same.members(dir.shallow.data);
          done();
        }
        catch (e) {
          done(e);
        }
      })
      .on("error", err => {
        done(err);
      });
  });

  it('should be able to pipe fs.Stats to other streams in "object mode"', done => {
    let allData = [];

    readdir.stream("test/dir", { stats: true })
      .pipe(through2({ objectMode: true }, (data, enc, next) => {
        try {
          // The data is an fs.Stats object
          expect(data).to.be.an("object");
          expect(data).to.be.an.instanceOf(fs.Stats);

          allData.push(data.path);
          next(null, data);
        }
        catch (e) {
          next(e);
        }
      }))
      .on("finish", () => {
        try {
          expect(allData).to.have.same.members(dir.shallow.data);
          done();
        }
        catch (e) {
          done(e);
        }
      })
      .on("error", done);
  });

  it("should be able to pause & resume the stream", done => {
    let allData = [];

    let stream = readdir.stream("test/dir")
      .on("data", data => {
        allData.push(data);

        // The stream should not be paused
        expect(stream.isPaused()).to.equal(false);

        if (allData.length === 3) {
          // Pause for one second
          stream.pause();
          setTimeout(() => {
            try {
              // The stream should still be paused
              expect(stream.isPaused()).to.equal(true);

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
      .on("end", () => {
        expect(allData).to.have.same.members(dir.shallow.data);
        done();
      })
      .on("error", done);
  });

  it('should be able to use "readable" and "read"', done => {
    let allData = [];
    let nullCount = 0;

    let stream = readdir.stream("test/dir")
      .on("readable", () => {
        // Manually read the next chunk of data
        let data = stream.read();

        while (true) {    // eslint-disable-line
          if (data === null) {
            // The stream is done
            nullCount++;
            break;
          }
          else {
            // The data should be a string (the file name)
            expect(data).to.be.a("string").with.length.of.at.least(1);
            allData.push(data);

            data = stream.read();
          }
        }
      })
      .on("end", () => {
        if (nodeVersion >= 12) {
          // In Node >= 12, the "readable" event fires twice,
          // and stream.read() returns null twice
          expect(nullCount).to.equal(2);
        }
        else if (nodeVersion >= 10) {
          // In Node >= 10, the "readable" event only fires once,
          // and stream.read() only returns null once
          expect(nullCount).to.equal(1);
        }
        else {
          // In Node < 10, the "readable" event fires 13 times (once per file),
          // and stream.read() returns null each time
          expect(nullCount).to.equal(13);
        }

        expect(allData).to.have.same.members(dir.shallow.data);
        done();
      })
      .on("error", done);
  });

  it('should be able to subscribe to custom events instead of "data"', done => {
    let allFiles = [];
    let allSubdirs = [];

    let stream = readdir.stream("test/dir");

    // Calling "resume" is required, since we're not handling the "data" event
    stream.resume();

    stream
      .on("file", filename => {
        expect(filename).to.be.a("string").with.length.of.at.least(1);
        allFiles.push(filename);
      })
      .on("directory", subdir => {
        expect(subdir).to.be.a("string").with.length.of.at.least(1);
        allSubdirs.push(subdir);
      })
      .on("end", () => {
        expect(allFiles).to.have.same.members(dir.shallow.files);
        expect(allSubdirs).to.have.same.members(dir.shallow.dirs);
        done();
      })
      .on("error", done);
  });

  it('should handle errors that occur in the "data" event listener', done => {
    testErrorHandling("data", dir.shallow.data, 7, done);
  });

  it('should handle errors that occur in the "file" event listener', done => {
    testErrorHandling("file", dir.shallow.files, 3, done);
  });

  it('should handle errors that occur in the "directory" event listener', done => {
    testErrorHandling("directory", dir.shallow.dirs, 2, done);
  });

  it('should handle errors that occur in the "symlink" event listener', done => {
    testErrorHandling("symlink", dir.shallow.symlinks, 5, done);
  });

  function testErrorHandling (eventName, expected, expectedErrors, done) {
    let errors = [], data = [];
    let stream = readdir.stream("test/dir");

    // Capture all errors
    stream.on("error", error => {
      errors.push(error);
    });

    stream.on(eventName, path => {
      data.push(path);

      if (path.indexOf(".txt") >= 0 || path.indexOf("dir-") >= 0) {
        throw new Error("Epic Fail!!!");
      }
      else {
        return true;
      }
    });

    stream.on("end", () => {
      try {
        // Make sure the correct number of errors were thrown
        expect(errors).to.have.lengthOf(expectedErrors);
        for (let error of errors) {
          expect(error.message).to.equal("Epic Fail!!!");
        }

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
