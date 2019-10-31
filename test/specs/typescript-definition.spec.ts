// tslint:disable: match-default-export-name completed-docs no-async-without-await
import readdir, { readdirAsync, readdirAsyncStat, readdirIterator, readdirIteratorStat, readdirStream, readdirStreamStat, readdirSync, readdirSyncStat, Stats } from "../../";

const root = "path/to/some/directory";
const options = {};
const pathsCallback = (err: Error | null, paths: string[]) => undefined;
const statsCallback = (err: Error | null, stats: Stats[]) => undefined;
const writableStream = {} as NodeJS.WritableStream;  // tslint:disable-line: no-object-literal-type-assertion
const pathHandler = (path: string) => undefined;
const pathsHandler = (paths: string[]) => undefined;
const statsHandler = (stats: Stats[]) => undefined;
const errorHandler = (err: Error) => undefined;
const statsFilter = (stats: Stats) => true;

export function testSyncApi() {
  readdir.sync(root);
  readdirSync(root);
  readdir.sync(root, options);
  readdirSync(root, options);

  readdir.sync.stat(root);
  readdirSyncStat(root);
  readdir.sync.stat(root, options);
  readdirSyncStat(root, options);
}

export function testCallbackApi() {
  readdir(root, pathsCallback);
  readdir.async(root, pathsCallback);
  readdirAsync(root, pathsCallback);
  readdir(root, options, pathsCallback);
  readdir.async(root, options, pathsCallback);
  readdirAsync(root, options, pathsCallback);

  readdir.async.stat(root, statsCallback);
  readdirAsyncStat(root, statsCallback);
  readdir.async.stat(root, options, statsCallback);
  readdirAsyncStat(root, options, statsCallback);
}

export function testPromiseApi() {
  readdir(root).then(pathsHandler).catch(errorHandler);
  readdir.async(root).then(pathsHandler).catch(errorHandler);
  readdirAsync(root).then(pathsHandler).catch(errorHandler);
  readdir(root, options).then(pathsHandler).catch(errorHandler);
  readdir.async(root, options).then(pathsHandler).catch(errorHandler);
  readdirAsync(root, options).then(pathsHandler).catch(errorHandler);

  readdir.async.stat(root).then(statsHandler).catch(errorHandler);
  readdirAsyncStat(root).then(statsHandler).catch(errorHandler);
  readdir.async.stat(root, options).then(statsHandler).catch(errorHandler);
  readdirAsyncStat(root, options).then(statsHandler).catch(errorHandler);
}

export function testEventEmitterApi() {
  readdir.stream(root).on("data", pathHandler).on("error", errorHandler);
  readdirStream(root).on("data", pathHandler).on("error", errorHandler);
  readdir.stream(root, options).on("data", pathHandler).on("error", errorHandler);
  readdirStream(root, options).on("data", pathHandler).on("error", errorHandler);

  readdir.stream.stat(root).on("data", statsHandler).on("error", errorHandler);
  readdirStreamStat(root).on("data", statsHandler).on("error", errorHandler);
  readdir.stream.stat(root, options).on("data", statsHandler).on("error", errorHandler);
  readdirStreamStat(root, options).on("data", statsHandler).on("error", errorHandler);
}

export function testStreamingApi() {
  readdir.stream(root).pipe(writableStream);
  readdirStream(root).pipe(writableStream);
  readdir.stream(root, options).pipe(writableStream);
  readdirStream(root, options).pipe(writableStream);

  readdir.stream.stat(root).pipe(writableStream);
  readdirStreamStat(root).pipe(writableStream);
  readdir.stream.stat(root, options).pipe(writableStream);
  readdirStreamStat(root, options).pipe(writableStream);
}

export async function testIteratorApi() {
  for await (let path of readdir.iterator(root)) { path = ""; }
  for await (let path of readdirIterator(root)) { path = ""; }
  for await (let path of readdir.iterator(root, options)) { path = ""; }
  for await (let path of readdirIterator(root, options)) { path = ""; }

  for await (let stats of readdir.iterator.stat(root)) { stats.path = ""; }
  for await (let stats of readdirIteratorStat(root)) { stats.path = ""; }
  for await (let stats of readdir.iterator.stat(root, options)) { stats.path = ""; }
  for await (let stats of readdirIteratorStat(root, options)) { stats.path = ""; }
}

export async function testDeepOption() {
  readdirSync(root, { deep: true });
  readdirAsync(root, { deep: true }, pathsCallback);
  readdirStream(root, { deep: true }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { deep: true })) { path = ""; }

  readdirSync(root, { deep: 5 });
  readdirAsync(root, { deep: 5 }, pathsCallback);
  readdirStream(root, { deep: 5 }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { deep: 5 })) { path = ""; }

  readdirSync(root, { deep: "subdir/**"});
  readdirAsync(root, { deep: "subdir/**"}, pathsCallback);
  readdirStream(root, { deep: "subdir/**"}).on("data", pathHandler);
  for await (let path of readdirIterator(root, { deep: "subdir/**"})) { path = ""; }

  readdirSync(root, { deep: /subdir|subdir2/});
  readdirAsync(root, { deep: /subdir|subdir2/}, pathsCallback);
  readdirStream(root, { deep: /subdir|subdir2/}).on("data", pathHandler);
  for await (let path of readdirIterator(root, { deep: /subdir|subdir2/})) { path = ""; }

  readdirSync(root, { deep: statsFilter });
  readdirAsync(root, { deep: statsFilter }, pathsCallback);
  readdirStream(root, { deep: statsFilter }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { deep: statsFilter })) { path = ""; }
}

export async function testFilterOption() {
  readdirSync(root, { filter: "*.txt" });
  readdirAsync(root, { filter: "*.txt" }, pathsCallback);
  readdirStream(root, { filter: "*.txt" }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { filter: "*.txt" })) { path = ""; }

  readdirSync(root, { filter: /\.txt$/ });
  readdirAsync(root, { filter: /\.txt$/ }, pathsCallback);
  readdirStream(root, { filter: /\.txt$/ }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { filter: /\.txt$/ })) { path = ""; }

  readdirSync(root, { filter: statsFilter });
  readdirAsync(root, { filter: statsFilter }, pathsCallback);
  readdirStream(root, { filter: statsFilter }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { filter: statsFilter })) { path = ""; }
}

export async function testBasePathOption() {
  readdirSync(root, { basePath: "/base/path" });
  readdirAsync(root, { basePath: "/base/path" }, pathsCallback);
  readdirStream(root, { basePath: "/base/path" }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { basePath: "/base/path" })) { path = ""; }
}

export async function testSepOption() {
  readdirSync(root, { sep: "/" });
  readdirAsync(root, { sep: "/" }, pathsCallback);
  readdirStream(root, { sep: "/" }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { sep: "/" })) { path = ""; }
}

export async function testFSOption() {
  const customFS = {
    readdir(dir: string, cb: (err: Error | null, names: string[]) => void): void {
      cb(null, [dir]);
    }
  };

  readdirSync(root, { fs: customFS });
  readdirAsync(root, { fs: customFS }, pathsCallback);
  readdirStream(root, { fs: customFS }).on("data", pathHandler);
  for await (let path of readdirIterator(root, { fs: customFS })) { path = ""; }
}
