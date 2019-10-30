import * as fs from "fs";
import { Readable } from "stream";
import { asyncForEach as forEach } from "../async/for-each";
import { DirectoryReader } from "../directory-reader";
import { Behavior } from "../types-internal";
import { Options } from "../types-public";

const streamFacade = { fs, forEach };

/**
 * Returns the `ReadableStream` of an asynchronous `DirectoryReader`.
 *
 * @internal
 */
export function readdirStream(dir: string, options: Options | undefined, behavior: Behavior): Readable {
  let reader = new DirectoryReader(dir, options, behavior, streamFacade);
  return reader.stream;
}
