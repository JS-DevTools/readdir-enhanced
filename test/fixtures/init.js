"use strict";

const del = require("del");
const path = require("path");
const fs = require("fs");

before(() => {
  console.log("Initializing test directory");

  // create some empty dirs (cannot check-in empty dirs to git)
  fs.mkdirSync("test/dir/.dotdir", { recursive: true });
  fs.mkdirSync("test/dir/empty", { recursive: true });
  fs.mkdirSync("test/dir/subdir/.dotdir/empty", { recursive: true });

  // create symlinks (checking symlinks into git is problematic cross-platform)
  symlink("test/dir/file.txt", "test/dir/file-symlink.txt", "file");
  symlink("test/dir/subdir/subsubdir/file.txt", "test/dir/subdir/subsubdir/file-symlink.txt", "file");
  symlink("test/dir/subdir", "test/dir/subdir-symlink", "dir");
  symlink("test/dir/subdir/subsubdir", "test/dir/subsubdir-symlink", "dir");

  // create broken symlinks (checking broken symlinks into git is problematic)
  brokenSymlink("test/dir/broken-symlink.txt", "file");
  brokenSymlink("test/dir/subdir/subsubdir/broken-symlink.txt", "file");
  brokenSymlink("test/dir/broken-dir-symlink", "dir");

  // delete files that get created automatically by the OS
  del.sync("test/dir/**/.DS_Store", { dot: true });
  del.sync("test/dir/**/Thumbs.db", { dot: true });
});

/**
 * Creates (or re-creates) a symbolic link.
 * If the symlink already exists, it is re-created, in case paths or permissions have changed.
 */
function symlink (targetPath, linkPath, type) {
  try {
    fs.unlinkSync(linkPath);
  }
  catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    }
  }

  targetPath = path.resolve(targetPath);
  fs.symlinkSync(targetPath, linkPath, type);
}

/**
 * Creates (or re-creates) a broken symbolic link.
 */
function brokenSymlink (linkPath, type) {
  let tmp = path.join(path.dirname(linkPath), Date.now() + type);

  if (type === "file") {
    fs.writeFileSync(tmp, "");
    symlink(tmp, linkPath, type);
    fs.unlinkSync(tmp);
  }
  else {
    fs.mkdirSync(tmp);
    symlink(tmp, linkPath, type);
    fs.rmdirSync(tmp);
  }
}
