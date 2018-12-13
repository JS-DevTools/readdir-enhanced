"use strict";

const forEachApi = require("../fixtures/for-each-api");
const dir = require("../fixtures/dir");
const expect = require("chai").expect;
const path = require("path");

let testDirAbsPath = path.resolve("test/dir");

describe("options.basePath", () => {
  forEachApi([
    {
      it: 'should return relative paths if basePath === "" (empty string)',
      args: ["test/dir", { basePath: "" }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should return relative paths if basePath === "."',
      args: ["test/dir", { basePath: "." }],
      assert (error, data) {
        expect(error).to.be.null;
        assertPathsMatch(data, dir.shallow.data, ".");
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        assertPathsMatch(data, dir.shallow.data, ".");
        assertPathsMatch(files, dir.shallow.files, ".");
        assertPathsMatch(dirs, dir.shallow.dirs, ".");
        assertPathsMatch(symlinks, dir.shallow.symlinks, ".");
      },
    },
    {
      it: "should return absolute paths if basePath === absolute path",
      args: ["test/dir", { basePath: testDirAbsPath }],
      assert (error, data) {
        expect(error).to.be.null;
        assertPathsMatch(data, dir.shallow.data, testDirAbsPath);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        assertPathsMatch(data, dir.shallow.data, testDirAbsPath);
        assertPathsMatch(files, dir.shallow.files, testDirAbsPath);
        assertPathsMatch(dirs, dir.shallow.dirs, testDirAbsPath);
        assertPathsMatch(symlinks, dir.shallow.symlinks, testDirAbsPath);
      },
    },
    {
      it: "should return relative paths to process.cwd() if basePath === path",
      args: ["test/dir", { basePath: "test/dir" }],
      assert (error, data) {
        expect(error).to.be.null;
        assertPathsMatch(data, dir.shallow.data, "test/dir");
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        assertPathsMatch(data, dir.shallow.data, "test/dir");
        assertPathsMatch(files, dir.shallow.files, "test/dir");
        assertPathsMatch(dirs, dir.shallow.dirs, "test/dir");
        assertPathsMatch(symlinks, dir.shallow.symlinks, "test/dir");
      },
    },
  ]);

  function assertPathsMatch (actual, expected, basePath) {
    let expectedAbsolutePaths = expected.map(relPath => {
      return basePath + path.sep + relPath;
    });
    expect(actual).to.have.same.members(expectedAbsolutePaths);
  }
});
