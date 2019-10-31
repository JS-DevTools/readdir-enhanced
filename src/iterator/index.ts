import * as fs from "fs";
import { asyncForEach as forEach } from "../async/for-each";
import { DirectoryReader } from "../directory-reader";
import { Behavior } from "../types-internal";
import { Options, Stats } from "../types-public";

const iteratorFacade = { fs, forEach };

/**
 * Enhanced `fs.readdir()` async iterator interface.
 */
export interface ReaddirIterator {
  /**
   * Aynchronous `readdir()` that returns an `AsyncIterableIterator` (an object that implements
   * both the `AsyncIterable` and `AsyncIterator` interfaces) that yields path strings.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
   */
  (dir: string, options?: Options): AsyncIterableIterator<string>;

  /**
   * Aynchronous `readdir()` that returns an `AsyncIterableIterator` (an object that implements
   * both the `AsyncIterable` and `AsyncIterator` interfaces) that yields `Stats` objects.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
   */
  stat(dir: string, options?: Options): AsyncIterableIterator<Stats>;
}

const iterator = readdirIterator as ReaddirIterator;
iterator.stat = readdirIteratorStat;
export { iterator };

/**
 * Aynchronous `readdir()` that returns an `AsyncIterableIterator` (an object that implements
 * both the `AsyncIterable` and `AsyncIterator` interfaces) that yields path strings.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 */
export function readdirIterator(dir: string, options?: Options): AsyncIterableIterator<string> {
  return readdirIteratorInternal(dir, options, {});
}

/**
 * Aynchronous `readdir()` that returns an `AsyncIterableIterator` (an object that implements
 * both the `AsyncIterable` and `AsyncIterator` interfaces) that yields `Stats` objects.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 */
export function readdirIteratorStat(dir: string, options?: Options): AsyncIterableIterator<Stats> {
  return readdirIteratorInternal(dir, options, { stats: true });
}

/**
 * Yields each chunk of an asynchronous `DirectoryReader`.
 */
function readdirIteratorInternal<T>(dir: string, options: Options | undefined, behavior: Behavior)
: AsyncIterableIterator<T> {
  let reader = new DirectoryReader(dir, options, behavior, iteratorFacade);
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
