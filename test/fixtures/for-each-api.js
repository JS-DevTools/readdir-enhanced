'use strict';

var readdir = require('../../');

module.exports = forEachApi;

function forEachApi(tests) {
  describe('Synchronous API', function() {
    tests.forEach(function(test) {
      it(test.it, function(done) {
        var data;

        try {
          if (test.options) {
            data = readdir.sync(test.dir, test.options);
          }
          else {
            data = readdir.sync(test.dir);
          }
        }
        catch (e) {
          if (test.error) {
            test.error(e);
          }
          else {
            done(e);
            return;
          }
        }

        try {
          test.data && test.data(data);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Asynchronous API (callback/Promise)', function() {
    tests.forEach(function(test) {
      it(test.it, function(done) {
        if (test.options) {
          readdir.async(test.dir, test.options, callback);
        }
        else {
          readdir.async(test.dir, callback);
        }

        function callback(err, data) {
          try {
            if (test.error) {
              test.error(err);
            }
            else if (err) {
              done(err);
              return;
            }

            test.data && test.data(data);
            done();
          }
          catch (e) {
            done(e);
          }
        }
      });
    });
  });

  describe('Asynchronous API (Stream/EventEmitter)', function() {
    tests.forEach(function(test) {
      it(test.it, function(done) {
        var stream;
        if (test.options) {
          stream = readdir.stream(test.dir, test.options);
        }
        else {
          stream = readdir.stream(test.dir);
        }

        var error, data = [], file = [], directory = [], symlink = [];
        stream.on('error', function(e) {
          error = e;
        });
        stream.on('file', function(f) {
          file.push(f);
        });
        stream.on('directory', function(d) {
          directory.push(d);
        });
        stream.on('symlink', function(s) {
          symlink.push(s);
        });
        stream.on('data', function(d) {
          data.push(d);
        });
        stream.on('end', function() {
          try {
            if (test.error) {
              test.error(error);
            }
            else if (error) {
              done(error);
              return;
            }

            test.error && test.error(error);
            test.file && test.file(file);
            test.directory && test.directory(directory);
            test.symlink && test.symlink(symlink);
            test.data && test.data(data);
            done();
          }
          catch (e) {
            done(e);
          }
        });
      });
    });
  });


}
