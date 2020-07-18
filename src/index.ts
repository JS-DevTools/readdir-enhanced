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

export { readdirAsync } from "./async";
export { readdirIterator } from "./iterator";
export { readdirStream } from "./stream";
export { readdirSync } from "./sync";
export * from "./types-public";
export { readdir };
export default readdir;

// CommonJS default export hack
/* eslint-env commonjs */
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);
}
