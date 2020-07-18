import { Callback } from "./types-public";

/**
 * A function that accepts an input value and returns an output value via a callback.
 * @internal
 */
export type Fn<TInput, TOutput> = (input: TInput, callback: Callback<TOutput>) => void;


/**
 * Calls a function with the given arguments, and ensures that the error-first callback is _always_
 * invoked exactly once, even if the function throws an error.
 *
 * @param fn - The function to invoke
 * @param args - The arguments to pass to the function. The final argument must be a callback function.
 *
 * @internal
 */
export function safeCall<TInput, TOutput>(fn: Fn<TInput, TOutput>, input: TInput, callback: Callback<TOutput>): void {
  // Replace the callback function with a wrapper that ensures it will only be called once
  callback = callOnce(callback);

  try {
    fn(input, callback);
  }
  catch (err) {
    callback(err as Error, undefined as unknown as TOutput);
  }
}


/**
 * Returns a wrapper function that ensures the given callback function is only called once.
 * Subsequent calls are ignored, unless the first argument is an Error, in which case the
 * error is thrown.
 *
 * @param callback - The function that should only be called once
 *
 * @internal
 */
export function callOnce<T>(callback: Callback<T>): Callback<T> {
  let fulfilled = false;

  return function onceWrapper(this: unknown, err: Error | null, result: T) {
    if (!fulfilled) {
      fulfilled = true;
      callback.call(this, err as Error, result);
    }
    else if (err) {
      // The callback has already been called, but now an error has occurred
      // (most likely inside the callback function). So re-throw the error,
      // so it gets handled further up the call stack
      throw err;
    }
  };
}
