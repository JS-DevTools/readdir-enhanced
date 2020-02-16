"use strict";

const forEachApi = require("../utils/for-each-api");
const { expect } = require("chai");

describe("error handling", () => {
  forEachApi([
    {
      it: "should throw an error if no arguments are passed",
      args: [],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.match(/must be a string|must be one of type string|must be of type string/);
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if the path is not a string",
      args: [55555],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.match(/must be a string|must be one of type string|must be of type string/);
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options are invalid",
      args: ["test/dir", "invalid options"],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal("options must be an object");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options.deep is invalid",
      args: ["test/dir", { deep: { foo: "bar" }}],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal("options.deep must be a boolean, number, function, regular expression, or glob pattern");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options.deep is negative",
      args: ["test/dir", { deep: -5 }],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("options.deep must be a positive number");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options.deep is NaN",
      args: ["test/dir", { deep: NaN }],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("options.deep must be a positive number");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options.deep is not an integer",
      args: ["test/dir", { deep: 5.4 }],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("options.deep must be an integer");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options.filter is invalid",
      args: ["test/dir", { filter: 12345 }],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal(
          "options.filter must be a boolean, function, regular expression, or glob pattern");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options.sep is invalid",
      args: ["test/dir", { sep: 57 }],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal("options.sep must be a string");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if options.basePath is invalid",
      args: ["test/dir", { basePath: 57 }],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal("options.basePath must be a string");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if the directory does not exist",
      args: ["test/dir/does-not-exist"],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal("ENOENT");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if the path is not a directory",
      args: ["test/dir/file.txt"],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal("ENOTDIR");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if the path is a broken symlink",
      args: ["test/dir/broken-dir-symlink"],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal("ENOENT");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should throw an error if `options.fs` is invalid",
      args: ["test/dir", { fs: "Hello, World" }],
      assert (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal("options.fs must be an object");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(1);
        expect(data).to.have.lengthOf(0);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
  ]);
});
