import { DirectoryReader } from "../directory-reader";
import { Behavior } from "../types-internal";
import { Options, Stats } from "../types-public";
import { syncForEach as forEach } from "./for-each";
import { syncFS as fs } from "./fs";

const syncFacade = { fs, forEach };

/**
 * Enhanced `fs.readdir()` synchronous interface.
 */
export interface ReaddirSync {
  /**
   * Synchronous `readdir()` that returns an array of string paths.
   */
  (dir: string, options?: Options): string[];

  /**
   * Synchronous `readdir()` that returns results as an array of `Stats` objects
   */
  stat(dir: string, options?: Options): Stats[];
}

const sync = readdirSync as ReaddirSync;
sync.stat = readdirSyncStat;
export { sync };

/**
 * Synchronous `readdir()` that returns an array of string paths.
 */
export function readdirSync(dir: string, options?: Options): string[] {
  return readdirSyncInternal(dir, options, {});
}

/**
 * Synchronous `readdir()` that returns results as an array of `Stats` objects
 */
export function readdirSyncStat(dir: string, options?: Options): Stats[] {
  return readdirSyncInternal(dir, options, { stats: true });
}

/**
 * Returns the buffered output from a synchronous `DirectoryReader`.
 */
function readdirSyncInternal<T>(dir: string, options: Options | undefined, behavior: Behavior): T[] {
  let reader = new DirectoryReader(dir, options, behavior, syncFacade);
  let stream = reader.stream;

  let results = [];
  let data: T = stream.read() as T;
  while (data !== null) {
    results.push(data);
    data = stream.read() as T;
  }

  return results;
}
