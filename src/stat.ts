import { Stats } from "fs";
import { safeCall } from "./call";
import { Callback, FileSystem } from "./types-public";

/**
 * Retrieves the {@link fs.Stats} for the given path. If the path is a symbolic link,
 * then the Stats of the symlink's target are returned instead.  If the symlink is broken,
 * then the Stats of the symlink itself are returned.
 *
 * @param fs - Synchronous or Asynchronouse facade for the "fs" module
 * @param path - The path to return stats for
 *
 * @internal
 */
export function stat(fs: FileSystem, path: string, callback: Callback<Stats>): void {
  let isSymLink = false;

  safeCall(fs.lstat, path, (err: Error | null, lstats: Stats) => {
    if (err) {
      // fs.lstat threw an eror
      return callback(err);
    }

    try {
      isSymLink = lstats.isSymbolicLink();
    }
    catch (err2) {
      // lstats.isSymbolicLink() threw an error
      // (probably because fs.lstat returned an invalid result)
      return callback(err2 as Error);
    }

    if (isSymLink) {
      // Try to resolve the symlink
      symlinkStat(fs, path, lstats, callback);
    }
    else {
      // It's not a symlink, so return the stats as-is
      callback(null, lstats);
    }
  });
}

/**
 * Retrieves the {@link fs.Stats} for the target of the given symlink.
 * If the symlink is broken, then the Stats of the symlink itself are returned.
 *
 * @param fs - Synchronous or Asynchronouse facade for the "fs" module
 * @param path - The path of the symlink to return stats for
 * @param lstats - The stats of the symlink
 */
function symlinkStat(fs: FileSystem, path: string, lstats: Stats, callback: Callback<Stats>): void {
  safeCall(fs.stat, path, (err: Error | null, stats: Stats) => {
    if (err) {
      // The symlink is broken, so return the stats for the link itself
      return callback(null, lstats);
    }

    try {
      // Return the stats for the resolved symlink target,
      // and override the `isSymbolicLink` method to indicate that it's a symlink
      stats.isSymbolicLink = () => true;
    }
    catch (err2) {
      // Setting stats.isSymbolicLink threw an error
      // (probably because fs.stat returned an invalid result)
      return callback(err2 as Error);
    }

    callback(null, stats);
  });
}
