// tslint:disable: no-default-export no-unsafe-any
import { async, readdirAsync, ReaddirAsync } from "./async";
import { ReaddirStream, stream } from "./stream";
import { ReaddirSync, sync } from "./sync";

/**
 * A backward-compatible drop-in replacement for Node's built-in `fs.readdir()` function that adds
 * support for additional features like filtering, recursion, absolute paths, and streaming.
 */
export interface Readdir extends ReaddirAsync {
  sync: ReaddirSync;
  async: ReaddirAsync;
  stream: ReaddirStream;
}

// Export type definitions
export * from "./types-public";

// Export the sync, async, and streaming interfaces
export { async, ReaddirAsync, readdirAsync, readdirAsyncStat } from "./async";
export { ReaddirStream, readdirStream, readdirStreamStat, stream } from "./stream";
export { ReaddirSync, readdirSync, readdirSyncStat, sync } from "./sync";

const readdir = readdirAsync as Readdir;
readdir.sync = sync;
readdir.async = async;
readdir.stream = stream;

export { readdir };
export default readdir;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);
}
