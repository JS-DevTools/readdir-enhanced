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
  ]);
});
