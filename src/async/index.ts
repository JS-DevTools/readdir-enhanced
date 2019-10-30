// tslint:disable: promise-function-async
import * as fs from "fs";
import { DirectoryReader } from "../directory-reader";
import { Behavior } from "../types-internal";
import { Callback, Options, Stats } from "../types-public";
import { asyncForEach as forEach } from "./for-each";

const asyncFacade = { fs, forEach };

/**
 * Enhanced `fs.readdir()` asynchronous interface.
 */
export interface ReaddirAsync {
  /**
   * Aynchronous `readdir()` that returns an array of path strings.
   */
  (dir: string, options?: Options): Promise<string[]>;

  /**
   * Aynchronous `readdir()` that returns an array of path strings via a callback.
   */
  (dir: string, callback: Callback<string[]>): void;

  /**
   * Aynchronous `readdir()` that returns an array of path strings via a callback.
   */
  (dir: string, options: Options | undefined, callback: Callback<string[]>): void;

  stat: {
    /**
     * Asynchronous `readdir()` that returns an array of `Stats` objects.
     */
    (dir: string, options?: Options): Promise<Stats[]>;

    /**
     * Asynchronous `readdir()` that returns an array of `Stats` objects via a callback.
     */
    (dir: string, callback: Callback<Stats[]>): void;

    /**
     * Asynchronous `readdir()` that returns an array of `Stats` objects via a callback.
     */
    (dir: string, options: Options | undefined, callback: Callback<Stats[]>): void;
  };
}

const async = readdirAsync as ReaddirAsync;
async.stat = readdirAsyncStat;
export { async };

/**
 * Aynchronous `readdir()` (accepts an error-first callback or returns a `Promise`).
 * Results are an array of path strings.
 */
export function readdirAsync(dir: string, options?: Options): Promise<string[]>;
export function readdirAsync(dir: string, callback: Callback<string[]>): void;
export function readdirAsync(dir: string, options: Options | undefined, callback: Callback<string[]>): void;
export function readdirAsync(dir: string, options: Options | Callback<string[]> | undefined, callback?: Callback<string[]>): Promise<string[]> | void {
  return readdirAsyncInternal(dir, options as Options, callback, {});
}

/**
 * Aynchronous `readdir()` (accepts an error-first callback or returns a `Promise`).
 * Results are an array of `Stats` objects.
 */
export function readdirAsyncStat(dir: string, options?: Options): Promise<Stats[]>;
export function readdirAsyncStat(dir: string, callback: Callback<Stats[]>): void;
export function readdirAsyncStat(dir: string, options: Options | undefined, callback: Callback<Stats[]>): void;
export function readdirAsyncStat(dir: string, options: Options | Callback<Stats[]> | undefined, callback?: Callback<Stats[]>): Promise<Stats[]> | void {
  return readdirAsyncInternal(dir, options as Options, callback, { stats: true });
}

/**
 * Returns the buffered output from an asynchronous `DirectoryReader`,
 * via an error-first callback or a `Promise`.
 */
function readdirAsyncInternal<T>(
dir: string, options: Options | undefined, callback: Callback<T[]> | undefined, behavior: Behavior)
: Promise<T[]> | void {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  let promise = new Promise<T[]>((resolve, reject) => {
    let results: T[] = [];
    let reader = new DirectoryReader(dir, options, behavior, asyncFacade);
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
