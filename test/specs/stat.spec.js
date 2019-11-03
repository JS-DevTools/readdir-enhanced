"use strict";

const readdir = require("../../");
const dir = require("../utils/dir");
const expect = require("chai").expect;
const fs = require("fs");

describe("fs.Stats", () => {
  describe("Synchronous API", () => {
    it("should return stats instead of paths", done => {
      let data = readdir.sync.stat("test/dir");
      assertStats(data, dir.shallow.data, done);
    });
  });

  describe("Asynchronous API (callback/Promise)", () => {
    it("should return stats instead of paths", done => {
      readdir.async.stat("test/dir", (err, data) => {
        expect(err).to.be.null;
        assertStats(data, dir.shallow.data, done);
      });
    });
  });

  describe("Asynchronous API (Stream/EventEmitter)", () => {
    it("should return stats instead of paths", done => {
      let error, data = [], files = [], dirs = [], symlinks = [];
      let stream = readdir.stream.stat("test/dir");

      stream.on("error", done);
      stream.on("data", dataInfo => {
        data.push(dataInfo);
      });
      stream.on("file", fileInfo => {
        files.push(fileInfo);
      });
      stream.on("directory", dirInfo => {
        dirs.push(dirInfo);
      });
      stream.on("symlink", symlinkInfo => {
        symlinks.push(symlinkInfo);
      });
      stream.on("end", () => {
        assertStats(data, dir.shallow.data, errorHandler);
        assertStats(files, dir.shallow.files, errorHandler);
        assertStats(dirs, dir.shallow.dirs, errorHandler);
        assertStats(symlinks, dir.shallow.symlinks, errorHandler);
        done(error);

        function errorHandler (e) { error = error || e; }
      });
    });
  });

  function assertStats (data, expected, done) {
    try {
      // Should return an array of the correct length
      expect(data).to.be.an("array").with.lengthOf(expected.length);

      // Should return the expected paths
      let paths = data.map(stat => { return stat.path; });
      expect(paths).to.have.same.members(expected);

      // Each item should be a valid fs.Stats object
      for (let stat of data) {
        expect(stat).to.be.an("object");
        expect(stat).to.be.an.instanceOf(fs.Stats);
        expect(stat.mode).to.be.a("number");
        expect(stat.uid).to.be.a("number");
        expect(stat.gid).to.be.a("number");
        expect(stat.size).to.be.a("number");
        expect(stat.atime).to.be.an.instanceOf(Date);
        expect(stat.mtime).to.be.an.instanceOf(Date);
        expect(stat.ctime).to.be.an.instanceOf(Date);
        expect(stat.path).to.be.a("string");
      }

      done();
    }
    catch (error) {
      done(error);
    }
  }
});
