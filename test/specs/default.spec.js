"use strict";

const forEachApi = require("../fixtures/for-each-api");
const dir = require("../fixtures/dir");
const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");

describe("default behavior", () => {
  forEachApi([
    {
      it: "should return the same results as `fs.readdir`",
      args: ["test/dir"],
      assert (error, data) {
        let fsResults = fs.readdirSync("test/dir");
        expect(error).to.be.null;
        expect(data).to.have.same.members(fsResults);
      },
    },
    {
      it: "should return an empty array for an empty dir",
      args: ["test/dir/empty"],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.be.an("array").with.lengthOf(0);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should return all top-level contents",
      args: ["test/dir"],
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
      it: "should return the same results if the path is absolute",
      args: [path.resolve("test/dir")],
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
      it: "should return all top-level contents of a directory symlink",
      args: ["test/dir/subdir-symlink"],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.subdir.shallow.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.subdir.shallow.data);
        expect(files).to.have.same.members(dir.subdir.shallow.files);
        expect(dirs).to.have.same.members(dir.subdir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.subdir.shallow.symlinks);
      },
    },
    {
      it: "should return relative paths",
      args: ["test/dir"],
      assert (error, data) {
        expect(error).to.be.null;
        data.forEach(item => {
          expect(item).not.to.contain("/");
          expect(item).not.to.contain("\\");
        });
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
  ]);
});
