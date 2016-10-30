'use strict';

var forEachApi = require('../fixtures/for-each-api');
var dir = require('../fixtures/dir');
var expect = require('chai').expect;
var path = require('path');

describe('options.sep', function () {
  forEachApi([
    {
      it: 'should have no effect if `options.deep` is not set',
      args: ['test/dir', { sep: '_' }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.shallow.data);
        expect(files).to.have.same.members(dir.shallow.files);
        expect(dirs).to.have.same.members(dir.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.shallow.symlinks);
      },
    },
    {
      it: 'should return POSIX paths if sep === "/"',
      args: ['test/dir', { deep: true, sep: '/' }],
      assert: function (error, data) {
        expect(error).to.be.null;
        assertPathsMatch(data, dir.deep.data, '/');
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        assertPathsMatch(data, dir.deep.data, '/');
        assertPathsMatch(files, dir.deep.files, '/');
        assertPathsMatch(dirs, dir.deep.dirs, '/');
        assertPathsMatch(symlinks, dir.deep.symlinks, '/');
      },
    },
    {
      it: 'should return Windows paths if sep === "\\"',
      args: ['test/dir', { deep: true, sep: '\\' }],
      assert: function (error, data) {
        expect(error).to.be.null;
        assertPathsMatch(data, dir.deep.data, '\\');
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        assertPathsMatch(data, dir.deep.data, '\\');
        assertPathsMatch(files, dir.deep.files, '\\');
        assertPathsMatch(dirs, dir.deep.dirs, '\\');
        assertPathsMatch(symlinks, dir.deep.symlinks, '\\');
      },
    },
    {
      it: 'should allow sep to be an empty string',
      args: ['test/dir', { deep: true, sep: '' }],
      assert: function (error, data) {
        expect(error).to.be.null;
        assertPathsMatch(data, dir.deep.data, '');
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        assertPathsMatch(data, dir.deep.data, '');
        assertPathsMatch(files, dir.deep.files, '');
        assertPathsMatch(dirs, dir.deep.dirs, '');
        assertPathsMatch(symlinks, dir.deep.symlinks, '');
      },
    },
    {
      it: 'should allow sep to be multiple characters',
      args: ['test/dir', { deep: true, sep: '-----' }],
      assert: function (error, data) {
        expect(error).to.be.null;
        assertPathsMatch(data, dir.deep.data, '-----');
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        assertPathsMatch(data, dir.deep.data, '-----');
        assertPathsMatch(files, dir.deep.files, '-----');
        assertPathsMatch(dirs, dir.deep.dirs, '-----');
        assertPathsMatch(symlinks, dir.deep.symlinks, '-----');
      },
    },
  ]);

  function assertPathsMatch (actual, expected, sep) {
    var regExp = new RegExp('\\' + path.sep, 'g');
    var expectedPaths = expected.map(function (expectedPath) {
      return expectedPath.replace(regExp, sep);
    });
    expect(actual).to.have.same.members(expectedPaths);
  }
});
