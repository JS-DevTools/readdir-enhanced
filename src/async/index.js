"use strict";

module.exports = readdirAsync;

const DirectoryReader = require("../directory-reader");

let asyncFacade = {
  fs: require("fs"),
  forEach: require("./for-each"),
};

/**
 * Returns the buffered output from an asynchronous {@link DirectoryReader},
 * via an error-first callback or a {@link Promise}.
 *
 * @param {string} dir
 * @param {object} [options]
 * @param {function} [callback]
 * @param {object} internalOptions
 */
function readdirAsync (dir, options, callback, internalOptions) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  return maybe(callback, new Promise(((resolve, reject) => {
    let results = [];

    internalOptions.facade = asyncFacade;

    let reader = new DirectoryReader(dir, options, internalOptions);
    let stream = reader.stream;

    stream.on("error", err => {
      reject(err);
      stream.pause();
    });
    stream.on("data", result => {
      results.push(result);
    });
    stream.on("end", () => {
      resolve(results);
    });
  })));
}

function maybe (cb, promise) {
  if (cb) {
    promise.then(
      (result) => cb(null, result),
      (err) => cb(err)
    );
  }
  else {
    return promise;
  }
}
