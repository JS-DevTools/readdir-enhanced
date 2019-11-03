"use strict";

const { default: defaultExport, readdir, readdirSync, readdirAsync, readdirIterator, readdirStream } = require("../../");
const expect = require("chai").expect;

describe("exports", () => {
  describe("Synchronous API", () => {
    it("should export the `readdirSync` function as `readdirSync`", done => {
      expect(readdirSync).to.be.a("function");
      expect(readdirSync.name).to.equal("readdirSync");
      done();
    });

    it("should alias `readdirSync` as `readdir.sync`", done => {
      expect(readdir.sync).to.be.a("function");
      expect(readdir.sync).to.equal(readdirSync);
      done();
    });
  });

  describe("Asynchronous API (callback/Promise)", () => {
    it("should export the `readdirAsync` function as the default export", done => {
      expect(defaultExport).to.be.a("function");
      expect(defaultExport).to.equal(readdirAsync);
      done();
    });

    it("should export the `readdirAsync` function as `readdir`", done => {
      expect(readdir).to.be.a("function");
      expect(readdir).to.equal(readdirAsync);
      done();
    });

    it("should alias `readdirAsync` as `readdirAync`", done => {
      expect(readdirAsync).to.be.a("function");
      expect(readdir.name).to.equal("readdirAsync");
      done();
    });

    it("should alias `readdirAsync` as `readdir.async`", done => {
      expect(readdir.async).to.be.a("function");
      expect(readdir.async).to.equal(readdirAsync);
      done();
    });
  });

  describe("Iterator API", () => {
    it("should export the `readdirIterator` function as `readdirIterator`", done => {
      expect(readdirIterator).to.be.a("function");
      expect(readdirIterator.name).to.equal("readdirIterator");
      done();
    });

    it("should alias `readdirIterator` as `readdir.iterator`", done => {
      expect(readdir.iterator).to.be.a("function");
      expect(readdir.iterator).to.equal(readdirIterator);
      done();
    });
  });

  describe("Asynchronous API (Stream/EventEmitter)", () => {
    it("should export the `readdirStream` function as `readdirStream`", done => {
      expect(readdirStream).to.be.a("function");
      expect(readdirStream.name).to.equal("readdirStream");
      done();
    });

    it("should alias `readdirStream` as `readdir.stream`", done => {
      expect(readdir.stream).to.be.a("function");
      expect(readdir.stream).to.equal(readdirStream);
      done();
    });
  });
});
