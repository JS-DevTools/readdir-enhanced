import { DirectoryReader } from "../directory-reader";
import { Options, Stats } from "../types-public";
import { syncForEach as forEach } from "./for-each";
import { syncFS as fs } from "./fs";

const syncFacade = { fs, forEach };

/**
 * A backward-compatible drop-in replacement for Node's built-in `fs.readdirSync()` function
 * that adds support for additional features like filtering, recursion, absolute paths, etc.
 */
export function readdirSync(dir: string, options?: Options & { stats?: false }): string[];

/**
 * Synchronous `readdir()` that returns results as an array of `Stats` objects
 */
export function readdirSync(dir: string, options: Options & { stats: true }): Stats[];

export function readdirSync<T>(dir: string, options?: Options): T[] {
  let reader = new DirectoryReader(dir, options, syncFacade);
  let stream = reader.stream;

  let results: T[] = [];
  let data: T = stream.read() as T;
  while (data !== null) {
    results.push(data);
    data = stream.read() as T;
  }

  return results;
}
