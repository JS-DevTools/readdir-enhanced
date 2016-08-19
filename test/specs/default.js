describe.only('default behavior', function() {
  'use strict';

  var forEachApi = require('../fixtures/for-each-api');
  var expected = require('../fixtures/expected');
  var expect = require('chai').expect;
  var fs = require('fs');

  forEachApi([
    {
      it: 'should return the same results as `fs.readdir`',
      dir: 'test/dir',
      assert: function(error, data) {
        var fsResults = fs.readdirSync('test/dir');
        expect(error).to.be.null;
        expect(data).to.have.same.members(fsResults);
      },
    },
    {
      it: 'should return an empty array for an empty dir',
      dir: 'test/dir/empty',
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.be.an('array').with.lengthOf(0);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should return all top-level contents',
      dir: 'test/dir',
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(expected.shallow);
      },
    },
    {
      it: 'should return all top-level contents of a directory symlink',
      dir: 'test/dir/subdir-symlink',
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(['.dotdir', 'file.txt', 'subsubdir']);
      },
    },
    {
      it: 'should return relative paths',
      dir: 'test/dir',
      assert: function(error, data) {
        expect(error).to.be.null;
        data.forEach(function(item) {
          expect(item).not.to.contain('/');
          expect(item).not.to.contain('\\');
        });
      },
    },
    {
      it: 'should throw an error if the directory does not exist',
      dir: 'test/dir/does-not-exist',
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
    },
    {
      it: 'should throw an error if the path is not a directory',
      dir: 'test/dir/file.txt',
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOTDIR');
        expect(data).to.be.undefined;
      },
    },
    {
      it: 'should throw an error if the path is a broken symlink',
      dir: 'test/dir/broken-dir-symlink',
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
    },
  ]);
});
