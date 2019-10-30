import { VoidCallback } from "./types-internal";
import { FileSystem } from "./types-public";


/**
 * Synchronous or asynchronous facades for various methods, including for the Node.js File System module
 * @internal
 */
export interface Facade {
  /**
   * Custom implementations of filesystem methods.
   */
  fs: FileSystem;

  /**
   * Calls the specified iterator function for each value in the array.
   * This method may be synchronous or asynchronous.
   */
  forEach<T>(array: T[], iterator: Iterator<T>, done: VoidCallback): void;
}

/**
 * Behavior options, which vary for each interface (sync, async, stream, etc.)
 */
export interface Behavior {
  /**
   * Indicates whether the reader should emit "file", "directory", and "symlink" events.
   */
  emit?: boolean;

  /**
   * Indicates whether the reader should emit `Stats` objects instead of path strings
   */
  stats?: boolean;
}

/**
 * A function that is called for each item in the array
 * @internal
 */
export type Iterator<T> = (item: T, callback: VoidCallback) => void;

/**
 * A callback function without any parameters.
 */
export type VoidCallback = () => void;
