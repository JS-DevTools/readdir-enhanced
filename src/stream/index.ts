import * as fs from "fs";
import { Readable } from "stream";
import { asyncForEach as forEach } from "../async/for-each";
import { DirectoryReader } from "../directory-reader";
import { Behavior } from "../types-internal";
import { Options } from "../types-public";

const streamFacade = { fs, forEach };

/**
 * Enhanced `fs.readdir()` streaming interface.
 */
export interface ReaddirStream {
  /**
   * Aynchronous `readdir()` that returns a `ReadableStream` (which is also an `EventEmitter`).
   * All stream data events ("data", "file", "directory", "symlink") are passed a path string.
   */
  (dir: string, options?: Options): Readable;

  /**
   * Aynchronous `readdir()` that returns a `ReadableStream` (which is also an `EventEmitter`)
   * All stream data events ("data", "file", "directory", "symlink") are passed a `Stats` object.
   */
  stat(dir: string, options?: Options): Readable;
}

const stream = readdirStream as ReaddirStream;
stream.stat = readdirStreamStat;
export { stream };

/**
 * Aynchronous `readdir()` that returns a `ReadableStream` (which is also an `EventEmitter`).
 * All stream data events ("data", "file", "directory", "symlink") are passed a path string.
 */
export function readdirStream(dir: string, options?: Options): Readable {
  return readdirStreamInternal(dir, options, {});
}

/**
 * Aynchronous `readdir()` that returns a `ReadableStream` (which is also an `EventEmitter`)
 * All stream data events ("data", "file", "directory", "symlink") are passed a `Stats` object.
 */
export function readdirStreamStat(dir: string, options?: Options): Readable {
  return readdirStreamInternal(dir, options, { stats: true });
}

/**
 * Returns the `ReadableStream` of an asynchronous `DirectoryReader`.
 */
function readdirStreamInternal(dir: string, options: Options | undefined, behavior: Behavior): Readable {
  let reader = new DirectoryReader(dir, options, behavior, streamFacade);
  return reader.stream;
}
