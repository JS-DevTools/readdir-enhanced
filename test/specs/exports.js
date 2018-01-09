'use strict';

let expect = require('chai').expect;

describe('exports', function () {
  describe('Synchronous API', function () {
    it('should export the `readdirSyncPath` function as `readdirSync`', function (done) {
      let readdir = require('../../');
      expect(readdir.readdirSync).to.be.a('function');
      expect(readdir.readdirSync.name).to.equal('readdirSyncPath');
      done();
    });

    it('should alias `readdirSyncPath` as `readdir.sync`', function (done) {
      let readdir = require('../../');
      expect(readdir.sync).to.be.a('function');
      expect(readdir.sync).to.equal(readdir.readdirSync);
      done();
    });

    it('should export the `readdirSyncStat` function', function (done) {
      let readdir = require('../../');
      expect(readdir.readdirSyncStat).to.be.a('function');
      expect(readdir.readdirSyncStat.name).to.equal('readdirSyncStat');
      done();
    });

    it('should alias `readdirSyncStat` as `readdir.sync.stat`', function (done) {
      let readdir = require('../../');
      expect(readdir.sync.stat).to.be.a('function');
      expect(readdir.sync.stat).to.equal(readdir.readdirSyncStat);
      done();
    });
  });

  describe('Asynchronous API (callback/Promise)', function () {
    it('should export the `readdirAsyncPath` function by default', function (done) {
      let readdir = require('../../');
      expect(readdir).to.be.a('function');
      expect(readdir.name).to.equal('readdirAsyncPath');
      done();
    });

    it('should alias `readdirAsyncPath` as `readdir.readdirAync`', function (done) {
      let readdir = require('../../');
      expect(readdir.readdirAsync).to.be.a('function');
      expect(readdir.readdirAsync).to.equal(readdir);
      done();
    });

    it('should alias `readdirAsyncPath` as `readdir.async`', function (done) {
      let readdir = require('../../');
      expect(readdir.async).to.be.a('function');
      expect(readdir.async).to.equal(readdir);
      done();
    });

    it('should export the `readdirAsyncStat` function', function (done) {
      let readdir = require('../../');
      expect(readdir.readdirAsyncStat).to.be.a('function');
      expect(readdir.readdirAsyncStat.name).to.equal('readdirAsyncStat');
      done();
    });

    it('should alias `readdirAsyncStat` as `readdir.async.stat`', function (done) {
      let readdir = require('../../');
      expect(readdir.async.stat).to.be.a('function');
      expect(readdir.async.stat).to.equal(readdir.readdirAsyncStat);
      done();
    });
  });

  describe('Asynchronous API (Stream/EventEmitter)', function () {
    it('should export the `readdirStreamPath` function as `readdirStream`', function (done) {
      let readdir = require('../../');
      expect(readdir.readdirStream).to.be.a('function');
      expect(readdir.readdirStream.name).to.equal('readdirStreamPath');
      done();
    });

    it('should alias `readdirStreamPath` as `readdir.stream`', function (done) {
      let readdir = require('../../');
      expect(readdir.stream).to.be.a('function');
      expect(readdir.stream).to.equal(readdir.readdirStream);
      done();
    });

    it('should export the `readdirStreamStat` function', function (done) {
      let readdir = require('../../');
      expect(readdir.readdirStreamStat).to.be.a('function');
      expect(readdir.readdirStreamStat.name).to.equal('readdirStreamStat');
      done();
    });

    it('should alias `readdirStreamStat` as `readdir.stream.stat`', function (done) {
      let readdir = require('../../');
      expect(readdir.stream.stat).to.be.a('function');
      expect(readdir.stream.stat).to.equal(readdir.readdirStreamStat);
      done();
    });
  });
});
