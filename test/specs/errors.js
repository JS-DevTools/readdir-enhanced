describe('error handling', function() {
  'use strict';

  var forEachApi = require('../fixtures/for-each-api');
  var dir = require('../fixtures/dir');
  var expect = require('chai').expect;

  forEachApi([
    {
      it: 'should throw an error if the directory does not exist',
      dir: 'test/dir/does-not-exist',
      assert: function(error, data) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.code).to.equal('ENOENT');
        expect(data).to.be.undefined;
      },
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
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
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
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
      streamAssert: function(errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(1);
        expect(data.length).to.equal(0);
        expect(files.length).to.equal(0);
        expect(dirs.length).to.equal(0);
        expect(symlinks.length).to.equal(0);
      },
    },

    // TODO: invalid data type for path param
    // TODO: invalid data type for options param
    // TODO: invalid data types for each option property
    // TODO: error thrown in the filter function
    // TODO: error thrown in each of the stream event listeners
  ]);
});
