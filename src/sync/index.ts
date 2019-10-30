import * as fs from "fs";
import { DirectoryReader } from "../directory-reader";
import { Behavior } from "../types-internal";
import { Options } from "../types-public";
import { syncForEach as forEach } from "./for-each";

const syncFacade = { fs, forEach };

/**
 * Returns the buffered output from a synchronous `DirectoryReader`.
 *
 * @internal
 */
export function readdirSync<T>(dir: string, options: Options | undefined, behavior: Behavior): T[] {
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
