'use strict';

var readdir = require('../../');
var dir = require('../fixtures/dir');
var expect = require('chai').expect;
var fs = require('fs');

describe('fs.Stats', function () {
  describe('Synchronous API', function () {
    it('should return stats instead of paths', function (done) {
      var data = readdir.sync.stat('test/dir');
      assertStats(data, dir.shallow.data, done);
    });
  });

  describe('Asynchronous API (callback/Promise)', function () {
    it('should return stats instead of paths', function (done) {
      readdir.async.stat('test/dir', function (err, data) {
        expect(err).to.be.null;
        assertStats(data, dir.shallow.data, done);
      });
    });
  });

  describe('Asynchronous API (Stream/EventEmitter)', function () {
    it('should return stats instead of paths', function (done) {
      var data = [], files = [], dirs = [], symlinks = [];
      var stream = readdir.stream.stat('test/dir');
      stream.on('error', done);
      stream.on('data', function (datum) {
        data.push(datum);
      });
      stream.on('file', function (file) {
        files.push(file);
      });
      stream.on('directory', function (dir) {
        dirs.push(dir);
      });
      stream.on('symlink', function (symlink) {
        symlinks.push(symlink);
      });
      stream.on('end', function () {
        assertStats(data, dir.shallow.data, errorHandler);
        assertStats(files, dir.shallow.files, errorHandler);
        assertStats(dirs, dir.shallow.dirs, errorHandler);
        assertStats(symlinks, dir.shallow.symlinks, errorHandler);
        done(error);

        var error;
        function errorHandler (e) { error = error || e; }
      });
    });
  });

  function assertStats (data, expected, done) {
    try {
      // Should return an array of the correct length
      expect(data).to.be.an('array').with.lengthOf(expected.length);

      // Should return the expected paths
      var paths = data.map(function (stat) { return stat.path; });
      expect(paths).to.have.same.members(expected);

      // Each item should be a valid fs.Stats object
      data.forEach(function (stat) {
        expect(stat).to.be.an('object');
        expect(stat).to.be.an.instanceOf(fs.Stats);
        expect(stat.mode).to.be.a('number');
        expect(stat.uid).to.be.a('number');
        expect(stat.gid).to.be.a('number');
        expect(stat.size).to.be.a('number');
        expect(stat.atime).to.be.an.instanceOf(Date);
        expect(stat.mtime).to.be.an.instanceOf(Date);
        expect(stat.ctime).to.be.an.instanceOf(Date);
        expect(stat.path).to.be.a('string');
      });

      done();
    }
    catch (error) {
      done(error);
    }
  }
});
