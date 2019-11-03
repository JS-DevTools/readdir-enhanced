// tslint:disable: no-default-export no-unsafe-any
import { readdirAsync } from "./async";
import { readdirIterator } from "./iterator";
import { readdirStream } from "./stream";
import { readdirSync } from "./sync";

/**
 * Enhanced `fs.readdir()`
 */
export type Readdir = typeof readdirAsync & {
  sync: typeof readdirSync;
  async: typeof readdirAsync;
  stream: typeof readdirStream;
  iterator: typeof readdirIterator;
};

const readdir = readdirAsync as Readdir;
readdir.sync = readdirSync;
readdir.async = readdirAsync;
readdir.stream = readdirStream;
readdir.iterator = readdirIterator;

export { readdir };
export default readdir;
export * from "./types-public";
export { readdirSync } from "./sync";
export { readdirAsync } from "./async";
export { readdirIterator } from "./iterator";
export { readdirStream } from "./stream";

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);
}
