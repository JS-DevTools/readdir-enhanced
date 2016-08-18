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
      data: function(data) {
        var fsResults = fs.readdirSync('test/dir');
        expect(data).to.have.same.members(fsResults);
      },
    },
    {
      it: 'should return an empty array for an empty dir',
      dir: 'test/dir/empty',
      data: function(data) {
        expect(data).to.be.an('array').with.lengthOf(0);
      },
    },
    {
      it: 'should return all shallow contents',
      dir: 'test/dir',
      data: function(data) {
        expect(data).to.have.same.members(expected.shallow);
      },
    },
    {
      it: 'should return relative paths',
      dir: 'test/dir',
      data: function(data) {
        data.forEach(function(item) {
          expect(item).not.to.contain('test/dir');
        });
      },
    },
    {
      it: 'should throw an error if the directory does not exist',
      dir: 'test/dir/does-not-exist',
      error: function(err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.code).to.equal('ENOENT');
      },
    },
  ]);
});
