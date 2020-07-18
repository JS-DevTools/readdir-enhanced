import * as fs from "fs";
import { DirectoryReader } from "../directory-reader";
import { Callback, Options, Stats } from "../types-public";
import { asyncForEach as forEach } from "./for-each";

const asyncFacade = { fs, forEach };

/**
 * A backward-compatible drop-in replacement for Node's built-in `fs.readdir()` function
 * that adds support for additional features like filtering, recursion, absolute paths, etc.
 */
export function readdirAsync(dir: string, callback: Callback<string[]>): void;

/**
 * A backward-compatible drop-in replacement for Node's built-in `fs.readdir()` function
 * that adds support for additional features like filtering, recursion, absolute paths, etc.
 */
export function readdirAsync(dir: string, options: undefined, callback: Callback<string[]>): void;

/**
 * A backward-compatible drop-in replacement for Node's built-in `fs.readdir()` function
 * that adds support for additional features like filtering, recursion, absolute paths, etc.
 */
export function readdirAsync(dir: string, options: Options & { stats?: false }, callback: Callback<string[]>): void;

/**
 * Asynchronous `readdir()` that returns an array of `Stats` objects via a callback.
 */
export function readdirAsync(dir: string, options: Options & { stats: true }, callback: Callback<Stats[]>): void;

/**
 * Asynchronous `readdir()` that returns its results via a Promise.
 */
export function readdirAsync(dir: string, options?: Options & { stats?: false }): Promise<string[]>;

/**
 * Asynchronous `readdir()` that returns an array of `Stats` objects via a Promise.
 */
export function readdirAsync(dir: string, options: Options & { stats: true }): Promise<Stats[]>;

export function readdirAsync<T>(dir: string, options: Options | Callback<T[]> | undefined, callback?: Callback<T[]>): Promise<T[]> | void {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  let promise = new Promise<T[]>((resolve, reject) => {
    let results: T[] = [];
    let reader = new DirectoryReader(dir, options as Options, asyncFacade);
    let stream = reader.stream;

    stream.on("error", (err: Error) => {
      reject(err);
      stream.pause();
    });
    stream.on("data", (result: T) => {
      results.push(result);
    });
    stream.on("end", () => {
      resolve(results);
    });
  });

  if (callback) {
    promise.then(
      (results: T[]) => callback!(null, results),
      (err: Error) => callback!(err, undefined as unknown as T[])
    );
  }
  else {
    return promise;
  }
}
