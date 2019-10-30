// tslint:disable: no-default-export no-unsafe-any
import { readdirAsync } from "./async";

// Export the sync, async, and streaming interfaces
export { async, ReaddirAsync, readdirAsync, readdirAsyncStat } from "./async";
export { ReaddirStream, readdirStream, readdirStreamStat, stream } from "./stream";
export { ReaddirSync, readdirSync, readdirSyncStat, sync } from "./sync";

// Export type definitions
export * from "./types-public";

// Export a drop-in replacement for Node's fs.readdir() function
export { readdirAsync as readdir };
export default readdirAsync;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);
}
