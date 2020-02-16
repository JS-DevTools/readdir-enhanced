import { createFilter } from "@jsdevtools/file-path-filter";
import * as path from "path";
import { Facade } from "./types-internal";
import { FilterFunction, Options, Stats } from "./types-public";

/**
 * Normalized and sanitized options.
 * @internal
 */
export interface NormalizedOptions {
  recurseDepth: number;
  recurseFn?: FilterFunction;
  recurseFnNeedsStats: boolean;
  filterFn?: FilterFunction;
  filterFnNeedsStats: boolean;
  sep: string;
  basePath: string;
  facade: Facade;
  emit: boolean;
  stats: boolean;
}

/**
 * Validates and normalizes the options argument
 *
 * @param [options] - User-specified options, if any
 * @param facade - sync or async function implementations
 * @param emit - Indicates whether the reader should emit "file", "directory", and "symlink" events.
 *
 * @internal
 */
// tslint:disable-next-line: cyclomatic-complexity
export function normalizeOptions(options: Options | undefined, facade: Facade, emit: boolean): NormalizedOptions {
  if (options === null || options === undefined) {
    options = {};
  }
  else if (typeof options !== "object") {
    throw new TypeError("options must be an object");
  }

  let sep = options.sep;
  if (sep === null || sep === undefined) {
    sep = path.sep;
  }
  else if (typeof sep !== "string") {
    throw new TypeError("options.sep must be a string");
  }

  let stats = Boolean(options.stats || options.withFileTypes);

  let recurseDepth, recurseFn, recurseFnNeedsStats = false, deep = options.deep;
  if (deep === null || deep === undefined) {
    recurseDepth = 0;
  }
  else if (typeof deep === "boolean") {
    recurseDepth = deep ? Infinity : 0;
  }
  else if (typeof deep === "number") {
    if (deep < 0 || isNaN(deep)) {
      throw new Error("options.deep must be a positive number");
    }
    else if (Math.floor(deep) !== deep) {
      throw new Error("options.deep must be an integer");
    }
    else {
      recurseDepth = deep;
    }
  }
  else if (typeof deep === "function") {
    // Recursion functions require a Stats object
    recurseFnNeedsStats = true;
    recurseDepth = Infinity;
    recurseFn = deep;
  }
  else if (deep instanceof RegExp || (typeof deep === "string" && deep.length > 0)) {
    recurseDepth = Infinity;
    recurseFn = createFilter({ map, sep }, deep);
  }
  else {
    throw new TypeError("options.deep must be a boolean, number, function, regular expression, or glob pattern");
  }

  let filterFn, filterFnNeedsStats = false, filter = options.filter;
  if (filter !== null && filter !== undefined) {
    if (typeof filter === "function") {
      // Filter functions requres a Stats object
      filterFnNeedsStats = true;
      filterFn = filter;
    }
    else if (
      filter instanceof RegExp ||
      typeof filter === "boolean" ||
      (typeof filter === "string" && filter.length > 0)) {
      filterFn = createFilter({ map, sep }, filter);
    }
    else {
      throw new TypeError("options.filter must be a boolean, function, regular expression, or glob pattern");
    }
  }

  let basePath = options.basePath;
  if (basePath === null || basePath === undefined) {
    basePath = "";
  }
  else if (typeof basePath === "string") {
    // Append a path separator to the basePath, if necessary
    if (basePath && basePath.substr(-1) !== sep) {
      basePath += sep;
    }
  }
  else {
    throw new TypeError("options.basePath must be a string");
  }

  // Determine which facade methods to use
  if (options.fs === null || options.fs === undefined) {
    // The user didn't provide their own facades, so use our internal ones
  }
  else if (typeof options.fs === "object") {
    // Merge the internal facade methods with the user-provided `fs` facades
    facade = Object.assign({}, facade);
    facade.fs = Object.assign({}, facade.fs, options.fs);
  }
  else {
    throw new TypeError("options.fs must be an object");
  }

  return {
    recurseDepth,
    recurseFn,
    recurseFnNeedsStats,
    filterFn,
    filterFnNeedsStats,
    stats,
    sep,
    basePath,
    facade,
    emit,
  };
}

/**
 * Maps our modified fs.Stats objects to file paths
 */
function map(stats: Stats) {
  return stats.path;
}
