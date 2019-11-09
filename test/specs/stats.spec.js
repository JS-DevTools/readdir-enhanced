"use strict";

const readdir = require("../../");
const dir = require("../utils/dir");
const isStats = require("../utils/is-stats");
const { expect } = require("chai");

describe("options.stats", () => {
  describe("Synchronous API", () => {
    it("should return stats instead of paths", done => {
      let data = readdir.sync("test/dir", { stats: true });
      assertStats(data, dir.shallow.data, done);
    });
  });

  describe("Asynchronous API (callback/Promise)", () => {
    it("should return stats instead of paths", done => {
      readdir.async("test/dir", { stats: true }, (err, data) => {
        expect(err).to.be.null;
        assertStats(data, dir.shallow.data, done);
      });
    });
  });

  describe("Stream/EventEmitter API", () => {
    it("should return stats instead of paths", done => {
      let error, data = [], files = [], dirs = [], symlinks = [];
      let stream = readdir.stream("test/dir", { stats: true });

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

  describe("Iterator API", () => {
    it("should return stats instead of paths", done => {
      Promise.resolve()
        .then(async () => {
          let data = [];

          for await (let stat of readdir.iterator("test/dir", { stats: true })) {
            data.push(stat);
          }

          assertStats(data, dir.shallow.data, done);
        })
        .catch(done);
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
        expect(stat).to.satisfy(isStats);
      }

      done();
    }
    catch (error) {
      done(error);
    }
  }
});
