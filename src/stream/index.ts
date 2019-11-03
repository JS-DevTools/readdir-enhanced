import * as fs from "fs";
import { Readable } from "stream";
import { asyncForEach as forEach } from "../async/for-each";
import { DirectoryReader } from "../directory-reader";
import { Options } from "../types-public";

const streamFacade = { fs, forEach };

/**
 * Aynchronous `readdir()` that returns a `ReadableStream` (which is also an `EventEmitter`).
 * All stream data events ("data", "file", "directory", "symlink") are passed a path string.
 */
export function readdirStream(dir: string, options?: Options & { stats?: false }): Readable;

/**
 * Aynchronous `readdir()` that returns a `ReadableStream` (which is also an `EventEmitter`).
 * All stream data events ("data", "file", "directory", "symlink") are passed a `Stats` object.
 */
export function readdirStream(dir: string, options: Options & { stats: true }): Readable;

export function readdirStream(dir: string, options?: Options): Readable {
  let reader = new DirectoryReader(dir, options, streamFacade, true);
  return reader.stream;
}
