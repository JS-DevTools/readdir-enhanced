"use strict";

const fs = require("fs");
const { expect } = require("chai");

module.exports = isStats;

/**
 * Assets that the given objects is a Readdir Enhanced Stats object.
 */
function isStats (stats) {
  expect(stats).to.be.an("object").and.instanceOf(fs.Stats);
  expect(stats.atime).to.be.an.instanceOf(Date);
  expect(stats.atimeMs).to.be.a("number").above(0);
  expect(stats.birthtime).to.be.an.instanceOf(Date);
  expect(stats.birthtimeMs).to.be.a("number").above(0);
  expect(stats.blksize).to.be.a("number").above(0);
  expect(stats.blocks).to.be.a("number").at.least(0);
  expect(stats.ctime).to.be.an.instanceOf(Date);
  expect(stats.ctimeMs).to.be.a("number").above(0);
  expect(stats.depth).to.be.a("number").at.least(0);
  expect(stats.dev).to.be.a("number").above(0);
  expect(stats.gid).to.be.a("number").at.least(0);
  expect(stats.ino).to.be.a("number").above(0);
  expect(stats.mode).to.be.a("number").above(0);
  expect(stats.mtime).to.be.an.instanceOf(Date);
  expect(stats.mtimeMs).to.be.a("number").above(0);
  expect(stats.nlink).to.be.a("number").above(0);
  expect(stats.path).to.be.a("string").with.length.above(0);
  expect(stats.rdev).to.be.a("number").at.least(0);
  expect(stats.size).to.be.a("number").at.least(0);
  expect(stats.uid).to.be.a("number").at.least(0);

  return true;
}
