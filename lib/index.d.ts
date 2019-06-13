import fs = require("fs");

/// <reference types="node" />

declare namespace readdir {
  type FilterFunction = (stat: Stats) => boolean;
  type Callback<T> = (err: NodeJS.ErrnoException | null, result: T) => void;
  type PathsArrayCallback = Callback<string[]>;
  type StatsArrayCallback = Callback<Stats[]>;

  interface Stats extends fs.Stats {
    path: string;
    depth: number;
  }

  interface FileSystem {
    readdir?: (path: string, callback: Callback<string[]>) => void;
    lstat?: (path: string, callback: Callback<fs.Stats>) => void;
    stat?: (path: string, callback: Callback<fs.Stats>) => void;
    [key: string]: any;
  }

  interface Options {
    filter?: string | RegExp | FilterFunction;
    deep?: boolean | number | string | RegExp | FilterFunction;
    sep?: string;
    basePath?: string;
    fs?: FileSystem;
  }

  function sync(root: string, options?: Options): string[];
  function readdirSync(root: string, options?: Options): string[];

  function stat(root: string, options?: Options): Stats[];
  function readdirSyncStat(root: string, options?: Options): Stats[];

  namespace sync {
    function stat(root: string, options?: Options): Stats[];
  }

  function async(root: string, options?: Options): Promise<string[]>;
  function async(root: string, callback: PathsArrayCallback): void;
  function async(root: string, options: Options, callback: PathsArrayCallback): void;

  function readdirAsync(root: string, options?: Options): Promise<string[]>;
  function readdirAsync(root: string, callback: PathsArrayCallback): void;
  function readdirAsync(root: string, options: Options, callback: PathsArrayCallback): void;

  function readdirAsyncStat(root: string, options?: Options): Promise<Stats[]>;
  function readdirAsyncStat(root: string, callback: StatsArrayCallback): void;
  function readdirAsyncStat(root: string, options: Options, callback: StatsArrayCallback): void;

  namespace async {
    function stat(root: string, options?: Options): Promise<Stats[]>;
    function stat(root: string, callback: StatsArrayCallback): void;
    function stat(root: string, options: Options, callback: StatsArrayCallback): void;
  }

  function stream(root: string, options?: Options): NodeJS.ReadableStream;
  function readdirStream(root: string, options?: Options): NodeJS.ReadableStream;
  function readdirStreamStat(root: string, options?: Options): NodeJS.ReadableStream;

  namespace stream {
    function stat(root: string, options?: Options): NodeJS.ReadableStream;
  }
}

declare function readdir(root: string, options?: readdir.Options): Promise<string[]>;
declare function readdir(root: string, callback: readdir.PathsArrayCallback): void;
declare function readdir(root: string, options: readdir.Options, callback: readdir.PathsArrayCallback): void;

export = readdir;
