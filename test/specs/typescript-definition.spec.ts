// tslint:disable-next-line: match-default-export-name
import readdir, { readdirAsync, readdirAsyncStat, readdirStream, readdirStreamStat, readdirSync, readdirSyncStat, Stats } from "../../";

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

// Synchronous API
readdir.sync(root);
readdirSync(root);
readdir.sync(root, options);
readdirSync(root, options);

readdir.sync.stat(root);
readdirSyncStat(root);
readdir.sync.stat(root, options);
readdirSyncStat(root, options);


// Callback API
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


// Promises API
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


// EventEmitter API
readdir.stream(root).on("data", pathHandler).on("error", errorHandler);
readdirStream(root).on("data", pathHandler).on("error", errorHandler);
readdir.stream(root, options).on("data", pathHandler).on("error", errorHandler);
readdirStream(root, options).on("data", pathHandler).on("error", errorHandler);

readdir.stream.stat(root).on("data", statsHandler).on("error", errorHandler);
readdirStreamStat(root).on("data", statsHandler).on("error", errorHandler);
readdir.stream.stat(root, options).on("data", statsHandler).on("error", errorHandler);
readdirStreamStat(root, options).on("data", statsHandler).on("error", errorHandler);


// Streaming API
readdir.stream(root).pipe(writableStream);
readdirStream(root).pipe(writableStream);
readdir.stream(root, options).pipe(writableStream);
readdirStream(root, options).pipe(writableStream);

readdir.stream.stat(root).pipe(writableStream);
readdirStreamStat(root).pipe(writableStream);
readdir.stream.stat(root, options).pipe(writableStream);
readdirStreamStat(root, options).pipe(writableStream);


// Options.deep
readdirSync(root, { deep: true });
readdirAsync(root, { deep: true }, pathsCallback);
readdirStream(root, { deep: true }).on("data", pathHandler);

readdirSync(root, { deep: 5 });
readdirAsync(root, { deep: 5 }, pathsCallback);
readdirStream(root, { deep: 5 }).on("data", pathHandler);

readdirSync(root, { deep: "subdir/**"});
readdirAsync(root, { deep: "subdir/**"}, pathsCallback);
readdirStream(root, { deep: "subdir/**"}).on("data", pathHandler);

readdirSync(root, { deep: /subdir|subdir2/});
readdirAsync(root, { deep: /subdir|subdir2/}, pathsCallback);
readdirStream(root, { deep: /subdir|subdir2/}).on("data", pathHandler);

readdirSync(root, { deep: statsFilter });
readdirAsync(root, { deep: statsFilter }, pathsCallback);
readdirStream(root, { deep: statsFilter }).on("data", pathHandler);


// Options.filter
readdirSync(root, { filter: "*.txt" });
readdirAsync(root, { filter: "*.txt" }, pathsCallback);
readdirStream(root, { filter: "*.txt" }).on("data", pathHandler);

readdirSync(root, { filter: /\.txt$/ });
readdirAsync(root, { filter: /\.txt$/ }, pathsCallback);
readdirStream(root, { filter: /\.txt$/ }).on("data", pathHandler);

readdirSync(root, { filter: statsFilter });
readdirAsync(root, { filter: statsFilter }, pathsCallback);
readdirStream(root, { filter: statsFilter }).on("data", pathHandler);


// Options.basePath
readdirSync(root, { basePath: "/base/path" });
readdirAsync(root, { basePath: "/base/path" }, pathsCallback);
readdirStream(root, { basePath: "/base/path" }).on("data", pathHandler);


// Options.sep
readdirSync(root, { sep: "/" });
readdirAsync(root, { sep: "/" }, pathsCallback);
readdirStream(root, { sep: "/" }).on("data", pathHandler);


// Options.fs
const customFS = {
  readdir(dir: string, cb: (err: Error | null, names: string[]) => void): void {
    cb(null, [dir]);
  }
};

readdirSync(root, { fs: customFS });
readdirAsync(root, { fs: customFS }, pathsCallback);
readdirStream(root, { fs: customFS }).on("data", pathHandler);
