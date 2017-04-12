'use strict';

var forEachApi = require('../fixtures/for-each-api');
var expect = require('chai').expect;

describe('error handling', function () {
  forEachApi([
    {
      it: 'should throw an error if no arguments are passed',
      args: [],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.contain('path must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the path is not a string',
      args: [55555],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.contain('path must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options are invalid',
      args: ['test/dir', 'invalid options'],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options must be an object');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is invalid',
      args: ['test/dir', { deep: { foo: 'bar' }}],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options.deep must be a boolean, number, function, regular expression, or glob pattern');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is negative',
      args: ['test/dir', { deep: -5 }],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('options.deep must be a positive number');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is NaN',
      args: ['test/dir', { deep: NaN }],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('options.deep must be a positive number');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.deep is not an integer',
      args: ['test/dir', { deep: 5.4 }],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('options.deep must be an integer');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.filter is invalid',
      args: ['test/dir', { filter: 12345 }],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal(
          'options.filter must be a function, regular expression, or glob pattern');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.sep is invalid',
      args: ['test/dir', { sep: 57 }],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options.sep must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if options.basePath is invalid',
      args: ['test/dir', { basePath: 57 }],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.equal('options.basePath must be a string');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the directory does not exist',
      args: ['test/dir/does-not-exist'],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the path is not a directory',
      args: ['test/dir/file.txt'],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOTDIR');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
    {
      it: 'should throw an error if the path is a broken symlink',
      args: ['test/dir/broken-dir-symlink'],
      assert: function (error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },
  ]);
});
