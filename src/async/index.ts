import * as fs from "fs";
import { DirectoryReader } from "../directory-reader";
import { Behavior } from "../types-internal";
import { Callback, Options } from "../types-public";
import { asyncForEach as forEach } from "./for-each";

const asyncFacade = { fs, forEach };

/**
 * Returns the buffered output from an asynchronous `DirectoryReader`,
 * via an error-first callback or a `Promise`.
 *
 * @internal
 */
export function readdirAsync<T>(
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
      (err: Error) => callback!(err)
    );
  }
  else {
    return promise;
  }
}
