'use strict';

var forEachApi = require('../fixtures/for-each-api');
var dir = require('../fixtures/dir');
var expect = require('chai').expect;

function customReaddirMethod (dirPath, callback) {
  callback(null, dir.txt.shallow.data);
}

describe('options.facade', function () {
  forEachApi([
    {
      it: 'should return the results from custom `readdir` method',
      args: ['test/dir', {
        facade: {
          async: { readdir: customReaddirMethod },
          sync: { readdir: customReaddirMethod },
        }
      }],
      assert: function (error, data) {
        expect(error).to.be.null;
        expect(data).to.have.same.members(dir.txt.shallow.data);
      },
      streamAssert: function (errors, data, files, dirs, symlinks) {
        expect(errors.length).to.equal(0);
        expect(data).to.have.same.members(dir.txt.shallow.data);
        expect(files).to.have.same.members(dir.txt.shallow.files);
        expect(dirs).to.have.same.members(dir.txt.shallow.dirs);
        expect(symlinks).to.have.same.members(dir.txt.shallow.symlinks);
      },
    },
  ]);
});
