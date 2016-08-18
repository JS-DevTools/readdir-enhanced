'use strict';

module.exports = stat;

/**
 * Retrieves the {@link fs.Stats} for the given path. If the path is a symbolic link,
 * then the Stats of the symlink's target are returned instead.  If the symlink is broken,
 * then the Stats of the symlink itself are returned.
 *
 * @param {object} helpers
 * @param {string} path
 * @param {function} callback
 */
function stat(helpers, path, callback) {
  helpers.lstat(path, function(err, lstats) {
    if (err) {
      return callback(err);
    }

    if (lstats.isSymbolicLink()) {
      // Try to resolve the symlink
      helpers.stat(path, function(err, stats) {
        if (err) {
          // Couldn't resolve the symlink, so return the stats for the link itself
          callback(null, lstats);
        }
        else {
          // Return the stats for the resolved symlink target,
          // but also override the `isSymbolicLink` method to indicate that it's a symlink
          stats.isSymbolicLink = function() { return true; };
          callback(null, stats);
        }
      });
    }
    else {
      // It's not a symlink, so return the stats as-is
      callback(null, lstats);
    }
  });
}
