"use strict";

const forEachApi = require("../utils/for-each-api");
const dir = require("../utils/dir");
const expect = require("chai").expect;

describe("options.filter", () => {
  forEachApi([
    {
      it: "should return filtered top-level contents",
      args: ["test/dir", {
        filter (stats) {
          return stats.path.indexOf("empty") >= 0;
        }
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(["empty", "empty.txt"]);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(["empty", "empty.txt"]);
        expect(files).to.have.same.members(["empty.txt"]);
        expect(dirs).to.have.same.members(["empty"]);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
    {
      it: "should return filtered deep contents",
      args: ["test/dir", {
        deep: true,
        filter (stats) {
          return stats.path.indexOf("empty") >= 0;
        }
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.empties.deep.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.empties.deep.data);
        expect(files).to.have.same.members(dir.empties.deep.files);
        expect(dirs).to.have.same.members(dir.empties.deep.dirs);
        expect(symlinks).to.have.same.members(dir.empties.deep.symlinks);
      },
    },
    {
      it: "should filter by files",
      args: ["test/dir", {
        deep: true,
        filter (stats) {
          return stats.isFile();
        }
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.files);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.deep.files);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.lengthOf(0);
        expect(symlinks).to.have.same.members(dir.symlinks.deep.files);
      },
    },
    {
      it: "should filter by directories",
      args: ["test/dir", {
        deep: true,
        filter (stats) {
          return stats.isDirectory();
        }
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.dirs);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.deep.dirs);
        expect(files).to.have.lengthOf(0);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.symlinks.deep.dirs);
      },
    },
    {
      it: "should filter by symlinks",
      args: ["test/dir", {
        deep: true,
        filter (stats) {
          return stats.isSymbolicLink();
        }
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.symlinks);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.deep.symlinks);
        expect(files).to.have.same.members(dir.symlinks.deep.files);
        expect(dirs).to.have.same.members(dir.symlinks.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: "should filter by a regular expression",
      args: ["test/dir", {
        filter: /.*empt[^aeiou]/,
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.empties.shallow.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.empties.shallow.data);
        expect(files).to.have.same.members(dir.empties.shallow.files);
        expect(dirs).to.have.same.members(dir.empties.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.empties.shallow.symlinks);
      },
    },
    {
      it: "should use appropriate path separators when filtering by a regular expression",
      args: ["test/dir", {
        deep: true,
        sep: "\\",
        filter: /subdir\\[^\\]*\\.*\.txt/,
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.data);
        expect(files).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.files);
        expect(dirs).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.dirs);
        expect(symlinks).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.symlinks);
      },
    },
    {
      it: "should filter by a glob pattern",
      args: ["test/dir", {
        filter: "empty*"
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.empties.shallow.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.empties.shallow.data);
        expect(files).to.have.same.members(dir.empties.shallow.files);
        expect(dirs).to.have.same.members(dir.empties.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.empties.shallow.symlinks);
      },
    },
    {
      it: "should use POSIX paths when filtering by a glob pattern",
      args: ["test/dir", {
        deep: true,
        sep: "\\",
        filter: "subdir/*/*.txt",
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.data);
        expect(files).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.files);
        expect(dirs).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.dirs);
        expect(symlinks).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromDir.symlinks);
      },
    },
    {
      it: "should prepend a POSIX version of the basePath when filtering by a glob pattern",
      args: ["test/dir", {
        deep: true,
        basePath: dir.windowsBasePath,
        sep: "\\",
        filter: "C:/Windows/**/subdir/*/*.txt",
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromRoot.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromRoot.data);
        expect(files).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromRoot.files);
        expect(dirs).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromRoot.dirs);
        expect(symlinks).to.have.same.members(dir.subdir.subsubdir.txt.windowsStyle.fromRoot.symlinks);
      },
    },
    {
      it: "should filter by a file extension pattern",
      args: ["test/dir", {
        deep: true,
        filter: "**/*.txt",
      }],
      assert (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.txt.deep.data);
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        expect(errors).to.have.lengthOf(0);
        expect(data).to.have.same.members(dir.txt.deep.data);
        expect(files).to.have.same.members(dir.txt.deep.files);
        expect(dirs).to.have.same.members(dir.txt.deep.dirs);
        expect(symlinks).to.have.same.members(dir.txt.deep.symlinks);
      },
    },
    {
      it: "should handle errors that occur in the filter function",
      args: ["test/dir", {
        filter (stats) {
          if (stats.isSymbolicLink()) {
            throw new Error("Boooooom!");
          }
          return true;
        }
      }],
      assert (error, data) {
        // The sync & async APIs abort after the first error and don't return any data
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Boooooom!");
        expect(data).to.be.undefined;
      },
      streamAssert (errors, data, files, dirs, symlinks) {
        // The streaming API emits errors and data separately
        expect(errors).to.have.lengthOf(5);
        expect(data).to.have.same.members([
          ".dotdir", "empty", "subdir", ".dotfile", "empty.txt", "file.txt", "file.json",
        ]);
        expect(files).to.have.same.members([
          ".dotfile", "empty.txt", "file.txt", "file.json",
        ]);
        expect(dirs).to.have.same.members([
          ".dotdir", "empty", "subdir",
        ]);
        expect(symlinks).to.have.lengthOf(0);
      },
    },
  ]);
});
