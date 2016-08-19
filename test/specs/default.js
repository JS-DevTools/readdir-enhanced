describe('default behavior', function() {
  'use strict';

  var forEachApi = require('../fixtures/for-each-api');
  var dir = require('../fixtures/dir');
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
        expect(data).to.have.same.members(dir.shallow.all);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.all);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should return all top-level contents of a directory symlink',
      dir: 'test/dir/subdir-symlink',
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.subdir.shallow.all);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.subdir.shallow.all);
        expect(files).to.have.same.members(dir.subdir.shallow.files);
        expect(dirs).to.have.same.members(dir.subdir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.subdir.shallow.symlinks);
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
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.all);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
  ]);
});
