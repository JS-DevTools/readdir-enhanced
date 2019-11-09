import * as fs from "fs";
import { asyncForEach as forEach } from "../async/for-each";
import { DirectoryReader } from "../directory-reader";
import { Options, Stats } from "../types-public";
import { Pending, pending } from "./pending";

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
  let pendingValues: T[] = [];
  let pendingReads: Array<Pending<IteratorResult<T>>> = [];
  let error: Error | undefined;
  let readable = false;
  let done = false;

  stream.on("error", function streamError(err: Error) {
    error = err;
    stream.pause();
    fulfillPendingReads();
  });

  stream.on("end", function streamEnd() {
    done = true;
    fulfillPendingReads();
  });

  stream.on("readable", function streamReadable() {
    readable = true;
    fulfillPendingReads();
  });

  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    // tslint:disable-next-line: promise-function-async
    next() {
      let pendingRead = pending<IteratorResult<T>>();
      pendingReads.push(pendingRead);

      // tslint:disable-next-line: no-floating-promises
      Promise.resolve().then(fulfillPendingReads);

      return pendingRead.promise;
    }
  };

  function fulfillPendingReads() {
    if (error) {
      while (pendingReads.length > 0) {
        let pendingRead = pendingReads.shift()!;
        pendingRead.reject(error);
      }
    }
    else if (pendingReads.length > 0) {
      while (pendingReads.length > 0) {
        let pendingRead = pendingReads.shift()!;
        let value = getNextValue();

        if (value) {
          pendingRead.resolve({ value });
        }
        else if (done) {
          pendingRead.resolve({ done, value });
        }
        else {
          pendingReads.unshift(pendingRead);
          break;
        }
      }
    }
  }

  function getNextValue(): T | undefined {
    let value = pendingValues.shift();
    if (value) {
      return value;
    }
    else if (readable) {
      readable = false;

      while (true) {
        value = stream.read() as T | undefined;
        if (value) {
          pendingValues.push(value);
        }
        else {
          break;
        }
      }

      return pendingValues.shift();
    }
  }
}
