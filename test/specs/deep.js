describe('options.deep', function() {
  'use strict';

  var forEachApi = require('../fixtures/for-each-api');
  var dir = require('../fixtures/dir');
  var expect = require('chai').expect;

  forEachApi([
    {
      it: 'should return all deep contents',
      args: ['test/dir', {deep: true}],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.data);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.data);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: 'should only return top-level contents if deep === false',
      args: ['test/dir', {deep: false}],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should only return top-level contents if deep === 0',
      args: ['test/dir', {deep: 0}],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should return 1-level deep contents',
      args: ['test/dir', {deep: 1}],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.oneLevel.data);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.oneLevel.data);
        expect(files).to.have.same.members(dir.deep.oneLevel.files);
        expect(dirs).to.have.same.members(dir.deep.oneLevel.dirs);
        expect(symlinks).to.have.same.members(dir.deep.oneLevel.symlinks);
      },
    },
    {
      it: 'should return all deep contents if deep is a number greater than the number of dirs',
      args: ['test/dir', {deep: 25}],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.data);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.data);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
    {
      it: 'should return all deep contents if deep === Infinity',
      args: ['test/dir', {deep: Infinity}],
      assert: function(error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.deep.data);
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.deep.data);
        expect(files).to.have.same.members(dir.deep.files);
        expect(dirs).to.have.same.members(dir.deep.dirs);
        expect(symlinks).to.have.same.members(dir.deep.symlinks);
      },
    },
  ]);
});
