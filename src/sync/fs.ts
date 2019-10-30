import * as fs from "fs";
import { callOnce } from "../call";
import { Callback, FileSystem } from "../types-public";

/**
 * Synchronous versions of `fs` methods.
 *
 * @internal
 */
export const syncFS: FileSystem = {
  /**
   * A facade around `fs.readdirSync()` that allows it to be called
   * the same way as `fs.readdir()`.
   */
  readdir(dir: string, callback: Callback<string[]>): void {
    // Make sure the callback is only called once
    callback = callOnce(callback);

    try {
      let items = fs.readdirSync(dir);
      callback(null, items);
    }
    catch (err) {
      callback(err as Error);
    }
  },

  /**
   * A facade around `fs.statSync()` that allows it to be called
   * the same way as `fs.stat()`.
   */
  stat(path: string, callback: Callback<fs.Stats>): void {
    // Make sure the callback is only called once
    callback = callOnce(callback);

    try {
      let stats = fs.statSync(path);
      callback(null, stats);
    }
    catch (err) {
      callback(err as Error);
    }
  },

  /**
   * A facade around `fs.lstatSync()` that allows it to be called
   * the same way as `fs.lstat()`.
   */
  lstat(path: string, callback: Callback<fs.Stats>): void {
    // Make sure the callback is only called once
    callback = callOnce(callback);

    try {
      let stats = fs.lstatSync(path);
      callback(null, stats);
    }
    catch (err) {
      callback(err as Error);
    }
  },
};
