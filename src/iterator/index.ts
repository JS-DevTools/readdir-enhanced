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
  let pendingValues: T[] = [];
  let pendingNext: Promise<IteratorResult<T>> | undefined;
  let resolvePendingNext: ((result: IteratorResult<T>) => void) | undefined;
  let rejectPendingNext: ((error: Error) => void) | undefined;
  let error: Error | undefined;
  let readable = false;
  let done = false;

  stream.on("error", function streamError(err: Error) {
    error = err;
    stream.pause();
    fulfillPendingNextIfPossible();
  });

  stream.on("end", function streamEnd() {
    done = true;
    fulfillPendingNextIfPossible();
  });

  stream.on("readable", function streamReadable() {
    readable = true;
    fulfillPendingNextIfPossible();
  });

  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    // tslint:disable-next-line: promise-function-async
    next() {
      if (!pendingNext) {
        pendingNext = new Promise((resolve, reject) => {
          resolvePendingNext = resolve;
          rejectPendingNext = reject;
        });
      }

      // tslint:disable-next-line: no-floating-promises
      Promise.resolve().then(fulfillPendingNextIfPossible);
      return pendingNext;
    }
  };

  function fulfillPendingNextIfPossible() {
    let fulfill, result;

    if (resolvePendingNext && rejectPendingNext) {
      if (error) {
        fulfill = rejectPendingNext;
        result = error;
      }
      else {
        let value = getNextValue();

        if (value) {
          fulfill = resolvePendingNext;
          result = { value };
        }
        else if (done) {
          fulfill = resolvePendingNext;
          result = { done, value };
        }
      }

      if (fulfill) {
        // NOTE: It's important to clear these BEEFORE fulfilling the Promise;
        // otherwise a sporadic race condition can occur.
        pendingNext = resolvePendingNext = rejectPendingNext = undefined;

        // @ts-ignore
        fulfill(result);
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
