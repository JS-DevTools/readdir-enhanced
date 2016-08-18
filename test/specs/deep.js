describe('options.deep', function() {
  'use strict';

  var expected = require('../fixtures/expected');
  var expect = require('chai').expect;
  var fs = require('fs');
  var path = require('path');

  it('should return deep contents', function(done) {
    var results = readdir('test/dir', {deep: true});

    expect(results).to.have.same.members(expected.deep);

    done();
  });

  it('should return an empty array for an empty dir', function(done) {
    var results = readdir('test/dir/empty', { deep: true });

    expect(results).to.be.an('array').with.lengthOf(0);

    done();
  });
});
