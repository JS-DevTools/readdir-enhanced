// describe('options.filter', function() {
//   'use strict';

//   var expected = require('../fixtures/expected');
//   var expect = require('chai').expect;
//   var fs = require('fs');
//   var path = require('path');

//   it('should return deep contents', function(done) {
//     var results = readdir('test/dir', {deep: true});

//     expect(results).to.have.same.members(expected.deep);

//     done();
//   });

//   it('should return filtered deep contents', function(done) {
//     var results = readdir('test/dir', {
//       deep: true,
//       filter: function(item) {
//         return path.basename(item.path) === 'file.txt';
//       },
//     });

//     expect(results).to.have.lengthOf(3);
//     expect(results).to.have.same.members([
//       'file.txt',
//       'subdir/file.txt',
//       'subdir-symlink/file.txt',
//     ]);

//     done();
//   });
// });
