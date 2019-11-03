import * as fs from "fs";

/**
 * Enhanced `fs.readdir()` options
 */
export interface Options {
  /**
   * Filter critiera. Can be a glob pattern, a regular expression, or a filter function.
   *
   * Defaults to returning all files.
   */
  filter?: string | RegExp | FilterFunction;

  /**
   * The depth to crawl. Can be `true` to crawl indefinitely, a number to crawl only to that
   * depth, or a filter (see the `filter` option) to crawl only directories that match the filter.
   *
   * Defaults to zero, which will not crawl subdirectories.
   */
  deep?: boolean | number | string | RegExp | FilterFunction;

  /**
   * Return `Stats` objects instead of just path strings.
   *
   * Defaults to `false`.
   */
  stats?: boolean;

  /**
   * Alias for the `stats` option. This property is supported for compatibility with the Node.js
   * built-in `fs.readdir()` function.
   */
  withFileTypes?: boolean;

  /**
   * The path separator to use.
   *
   * Defaults to "\" on Windows and "/" on other platforms.
   */
  sep?: string;

  /**
   * The baase path to prefix results with.
   *
   * Defaults to an empty string, which means results will be relative to the directory path.
   */
  basePath?: string;

  /**
   * Custom implementations of filesystem methods.
   *
   * Defaults to the Node "fs" module.
   */
  fs?: Partial<FileSystem>;
}

/**
 * Custom implementations of filesystem methods.
 */
export interface FileSystem {
  /**
   * Returns the names of files in a directory.
   */
  readdir(path: string, callback: Callback<string[]>): void;

  /**
   * Returns filesystem information about a directory entry.
   */
  stat(path: string, callback: Callback<fs.Stats>): void;

  /**
   * Returns filesystem information about a symlink.
   */
  lstat(path: string, callback: Callback<fs.Stats>): void;
}

/**
 * An `fs.Stats` object with additional information.
 */
export interface Stats extends fs.Stats {
  /**
   * The relative path of the file.
   *
   * NOTE: The value is affected by the `basePath` and `sep` options.
   */
  path: string;

  /**
   * The depth of this entry, relative to the original directory.
   */
  depth: number;
}

/**
 * A function that determines whether a path should be included or not.
 */
export type FilterFunction = (stat: Stats) => unknown;

/**
 * An error-first callback function.
 */
export type Callback<T> = (err: Error | null, result: T) => void;

/**
 * The events that can be emitted by the stream interface.
 */
export type EventName = "error" | "file" | "directory" | "symlink";
