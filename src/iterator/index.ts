import * as fs from "fs";
import { asyncForEach as forEach } from "../async/for-each";
import { DirectoryReader } from "../directory-reader";
import { Options, Stats } from "../types-public";

const iteratorFacade = { fs, forEach };

/**
 * Aynchronous `readdir()` that returns an `AsyncIterableIterator` (an object that implements
 * both the `AsyncIterable` and `AsyncIterator` interfaces) that yields path strings.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 */
export function readdirIterator(dir: string, options?: Options & { stats?: false }): AsyncIterableIterator<string>;

/**
 * Aynchronous `readdir()` that returns an `AsyncIterableIterator` (an object that implements
 * both the `AsyncIterable` and `AsyncIterator` interfaces) that yields `Stats` objects.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 */
export function readdirIterator(dir: string, options: Options & { stats: true }): AsyncIterableIterator<Stats>;

export function readdirIterator<T>(dir: string, options?: Options): AsyncIterableIterator<T> {
  let reader = new DirectoryReader(dir, options, iteratorFacade);
  let stream = reader.stream;

  let error: Error | undefined;
  stream.on("error", (err: Error) => {
    error = err;
    stream.pause();
  });

  let done = false;
  stream.on("end", () => {
    done = true;
  });

  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    // tslint:disable-next-line: promise-function-async
    next() {
      return new Promise((resolve, reject) => {
        shortCircuit() || stream.on("readable", readNextResult);

        function shortCircuit() {
          if (error) {
            reject(error);
            return true;
          }
          else if (done) {
            resolve({ done, value: undefined });
            return true;
          }
        }

        function readNextResult() {
          try {
            if (shortCircuit()) {
              return;
            }

            let value = stream.read() as T | null;
            stream.off("readable", readNextResult);

            if (value === null) {
              done = true;
            }

            shortCircuit() || resolve({ value: value! });
          }
          catch (err) {
            reject(err as Error);
          }
        }
      });
    },
  };
}
