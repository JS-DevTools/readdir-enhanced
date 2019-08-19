"use strict";

const path = require("path");

// This fake basePath is used to make sure Windows paths are handled properly.
let windowsBasePath = "C:\\Windows\\Users\\Desktop";

let dir = module.exports = {
  windowsBasePath,

  path: changePathSeparators,

  shallow: {
    data: [
      ".dotdir",
      ".dotfile",
      "broken-dir-symlink",
      "broken-symlink.txt",
      "empty",
      "empty.txt",
      "file-symlink.txt",
      "file.json",
      "file.txt",
      "subdir",
      "subdir-symlink",
      "subsubdir-symlink",
    ],
    dirs: [
      ".dotdir",
      "empty",
      "subdir",
      "subdir-symlink",
      "subsubdir-symlink",
    ],
    files: [
      ".dotfile",
      "empty.txt",
      "file-symlink.txt",
      "file.json",
      "file.txt",
    ],
    symlinks: [
      "broken-dir-symlink",
      "broken-symlink.txt",
      "file-symlink.txt",
      "subdir-symlink",
      "subsubdir-symlink",
    ],
  },

  deep: {
    data: [
      ".dotdir",
      ".dotfile",
      "broken-dir-symlink",
      "broken-symlink.txt",
      "empty",
      "empty.txt",
      "file-symlink.txt",
      "file.json",
      "file.txt",
      "subdir",
      "subdir-symlink",
      "subdir-symlink/.dotdir",
      "subdir-symlink/.dotdir/.dotfile",
      "subdir-symlink/.dotdir/empty",
      "subdir-symlink/file.txt",
      "subdir-symlink/subsubdir",
      "subdir-symlink/subsubdir/broken-symlink.txt",
      "subdir-symlink/subsubdir/empty.txt",
      "subdir-symlink/subsubdir/file-symlink.txt",
      "subdir-symlink/subsubdir/file.json",
      "subdir-symlink/subsubdir/file.txt",
      "subdir/.dotdir",
      "subdir/.dotdir/.dotfile",
      "subdir/.dotdir/empty",
      "subdir/file.txt",
      "subdir/subsubdir",
      "subdir/subsubdir/broken-symlink.txt",
      "subdir/subsubdir/empty.txt",
      "subdir/subsubdir/file-symlink.txt",
      "subdir/subsubdir/file.json",
      "subdir/subsubdir/file.txt",
      "subsubdir-symlink",
      "subsubdir-symlink/broken-symlink.txt",
      "subsubdir-symlink/empty.txt",
      "subsubdir-symlink/file-symlink.txt",
      "subsubdir-symlink/file.json",
      "subsubdir-symlink/file.txt",
    ],
    dirs: [
      ".dotdir",
      "empty",
      "subdir",
      "subdir-symlink",
      "subdir-symlink/.dotdir",
      "subdir-symlink/.dotdir/empty",
      "subdir-symlink/subsubdir",
      "subdir/.dotdir",
      "subdir/.dotdir/empty",
      "subdir/subsubdir",
      "subsubdir-symlink",
    ],
    files: [
      ".dotfile",
      "empty.txt",
      "file-symlink.txt",
      "file.json",
      "file.txt",
      "subdir-symlink/.dotdir/.dotfile",
      "subdir-symlink/file.txt",
      "subdir-symlink/subsubdir/empty.txt",
      "subdir-symlink/subsubdir/file-symlink.txt",
      "subdir-symlink/subsubdir/file.json",
      "subdir-symlink/subsubdir/file.txt",
      "subdir/.dotdir/.dotfile",
      "subdir/file.txt",
      "subdir/subsubdir/empty.txt",
      "subdir/subsubdir/file-symlink.txt",
      "subdir/subsubdir/file.json",
      "subdir/subsubdir/file.txt",
      "subsubdir-symlink/empty.txt",
      "subsubdir-symlink/file-symlink.txt",
      "subsubdir-symlink/file.json",
      "subsubdir-symlink/file.txt",
    ],
    symlinks: [
      "broken-dir-symlink",
      "broken-symlink.txt",
      "file-symlink.txt",
      "subdir-symlink",
      "subdir-symlink/subsubdir/broken-symlink.txt",
      "subdir-symlink/subsubdir/file-symlink.txt",
      "subdir/subsubdir/broken-symlink.txt",
      "subdir/subsubdir/file-symlink.txt",
      "subsubdir-symlink",
      "subsubdir-symlink/broken-symlink.txt",
      "subsubdir-symlink/file-symlink.txt",
    ],

    oneLevel: {
      data: [
        ".dotdir",
        ".dotfile",
        "broken-dir-symlink",
        "broken-symlink.txt",
        "empty",
        "empty.txt",
        "file-symlink.txt",
        "file.json",
        "file.txt",
        "subdir",
        "subdir-symlink",
        "subdir-symlink/.dotdir",
        "subdir-symlink/file.txt",
        "subdir-symlink/subsubdir",
        "subdir/.dotdir",
        "subdir/file.txt",
        "subdir/subsubdir",
        "subsubdir-symlink",
        "subsubdir-symlink/broken-symlink.txt",
        "subsubdir-symlink/empty.txt",
        "subsubdir-symlink/file-symlink.txt",
        "subsubdir-symlink/file.json",
        "subsubdir-symlink/file.txt",
      ],
      dirs: [
        ".dotdir",
        "empty",
        "subdir",
        "subdir-symlink",
        "subdir-symlink/.dotdir",
        "subdir-symlink/subsubdir",
        "subdir/.dotdir",
        "subdir/subsubdir",
        "subsubdir-symlink",
      ],
      files: [
        ".dotfile",
        "empty.txt",
        "file-symlink.txt",
        "file.json",
        "file.txt",
        "subdir-symlink/file.txt",
        "subdir/file.txt",
        "subsubdir-symlink/empty.txt",
        "subsubdir-symlink/file-symlink.txt",
        "subsubdir-symlink/file.json",
        "subsubdir-symlink/file.txt",
      ],
      symlinks: [
        "broken-dir-symlink",
        "broken-symlink.txt",
        "file-symlink.txt",
        "subdir-symlink",
        "subsubdir-symlink",
        "subsubdir-symlink/broken-symlink.txt",
        "subsubdir-symlink/file-symlink.txt",
      ],
    },
  },

  subdir: {
    shallow: {
      data: [
        ".dotdir",
        "file.txt",
        "subsubdir",
      ],
      dirs: [
        ".dotdir",
        "subsubdir",
      ],
      files: [
        "file.txt",
      ],
      symlinks: [],
    },

    deep: {
      data: [
        ".dotdir",
        ".dotdir/.dotfile",
        ".dotdir/empty",
        "file.txt",
        "subsubdir",
        "subsubdir/broken-symlink.txt",
        "subsubdir/empty.txt",
        "subsubdir/file-symlink.txt",
        "subsubdir/file.json",
        "subsubdir/file.txt",
      ],
      dirs: [
        ".dotdir",
        ".dotdir/empty",
        "subsubdir",
      ],
      files: [
        ".dotdir/.dotfile",
        "file.txt",
        "subsubdir/empty.txt",
        "subsubdir/file-symlink.txt",
        "subsubdir/file.json",
        "subsubdir/file.txt",
      ],
      symlinks: [
        "subsubdir/broken-symlink.txt",
        "subsubdir/file-symlink.txt",
      ],
    },

    txt: {
      shallow: {
        data: [
          "file.txt",
        ],
        dirs: [],
        files: [
          "file.txt",
        ],
        symlinks: [],
      },

      deep: {
        data: [
          "file.txt",
          "subsubdir/broken-symlink.txt",
          "subsubdir/empty.txt",
          "subsubdir/file-symlink.txt",
          "subsubdir/file.txt",
        ],
        dirs: [],
        files: [
          "file.txt",
          "subsubdir/empty.txt",
          "subsubdir/file-symlink.txt",
          "subsubdir/file.txt",
        ],
        symlinks: [
          "subsubdir/broken-symlink.txt",
          "subsubdir/file-symlink.txt",
        ],
      },
    },

    subsubdir: {
      data: [
        "broken-symlink.txt",
        "empty.txt",
        "file-symlink.txt",
        "file.json",
        "file.txt",
      ],
      dirs: [],
      files: [
        "empty.txt",
        "file-symlink.txt",
        "file.json",
        "file.txt",
      ],
      symlinks: [
        "broken-symlink.txt",
        "file-symlink.txt",
      ],

      txt: {
        data: [
          "broken-symlink.txt",
          "empty.txt",
          "file-symlink.txt",
          "file.txt",
        ],
        dirs: [],
        files: [
          "empty.txt",
          "file-symlink.txt",
          "file.txt",
        ],
        symlinks: [
          "broken-symlink.txt",
          "file-symlink.txt",
        ],

        windowsStyle: {
          fromDir: {
            data: [
              "subdir\\subsubdir\\broken-symlink.txt",
              "subdir\\subsubdir\\empty.txt",
              "subdir\\subsubdir\\file-symlink.txt",
              "subdir\\subsubdir\\file.txt",
            ],
            dirs: [],
            files: [
              "subdir\\subsubdir\\empty.txt",
              "subdir\\subsubdir\\file-symlink.txt",
              "subdir\\subsubdir\\file.txt",
            ],
            symlinks: [
              "subdir\\subsubdir\\broken-symlink.txt",
              "subdir\\subsubdir\\file-symlink.txt",
            ],
          },

          fromRoot: {
            data: [
              windowsBasePath + "\\subdir\\subsubdir\\broken-symlink.txt",
              windowsBasePath + "\\subdir\\subsubdir\\empty.txt",
              windowsBasePath + "\\subdir\\subsubdir\\file-symlink.txt",
              windowsBasePath + "\\subdir\\subsubdir\\file.txt",
            ],
            dirs: [],
            files: [
              windowsBasePath + "\\subdir\\subsubdir\\empty.txt",
              windowsBasePath + "\\subdir\\subsubdir\\file-symlink.txt",
              windowsBasePath + "\\subdir\\subsubdir\\file.txt",
            ],
            symlinks: [
              windowsBasePath + "\\subdir\\subsubdir\\broken-symlink.txt",
              windowsBasePath + "\\subdir\\subsubdir\\file-symlink.txt",
            ],
          },
        }
      },
    }
  },

  txt: {
    shallow: {
      data: [
        "broken-symlink.txt",
        "empty.txt",
        "file.txt",
        "file-symlink.txt",
      ],
      dirs: [],
      files: [
        "empty.txt",
        "file.txt",
        "file-symlink.txt",
      ],
      symlinks: [
        "broken-symlink.txt",
        "file-symlink.txt",
      ],
    },

    deep: {
      data: [
        "broken-symlink.txt",
        "empty.txt",
        "file-symlink.txt",
        "file.txt",
        "subdir/file.txt",
        "subdir/subsubdir/broken-symlink.txt",
        "subdir/subsubdir/empty.txt",
        "subdir/subsubdir/file-symlink.txt",
        "subdir/subsubdir/file.txt",
        "subdir-symlink/file.txt",
        "subdir-symlink/subsubdir/broken-symlink.txt",
        "subdir-symlink/subsubdir/empty.txt",
        "subdir-symlink/subsubdir/file-symlink.txt",
        "subdir-symlink/subsubdir/file.txt",
        "subsubdir-symlink/broken-symlink.txt",
        "subsubdir-symlink/empty.txt",
        "subsubdir-symlink/file-symlink.txt",
        "subsubdir-symlink/file.txt",
      ],
      dirs: [],
      files: [
        "empty.txt",
        "file.txt",
        "file-symlink.txt",
        "subdir/file.txt",
        "subdir/subsubdir/empty.txt",
        "subdir/subsubdir/file.txt",
        "subdir/subsubdir/file-symlink.txt",
        "subdir-symlink/file.txt",
        "subdir-symlink/subsubdir/empty.txt",
        "subdir-symlink/subsubdir/file.txt",
        "subdir-symlink/subsubdir/file-symlink.txt",
        "subsubdir-symlink/empty.txt",
        "subsubdir-symlink/file.txt",
        "subsubdir-symlink/file-symlink.txt",
      ],
      symlinks: [
        "broken-symlink.txt",
        "file-symlink.txt",
        "subdir/subsubdir/broken-symlink.txt",
        "subdir/subsubdir/file-symlink.txt",
        "subdir-symlink/subsubdir/broken-symlink.txt",
        "subdir-symlink/subsubdir/file-symlink.txt",
        "subsubdir-symlink/broken-symlink.txt",
        "subsubdir-symlink/file-symlink.txt",
      ],
    },
  },

  empties: {
    shallow: {
      data: [
        "empty",
        "empty.txt",
      ],
      dirs: [
        "empty",
      ],
      files: [
        "empty.txt",
      ],
      symlinks: [],
    },

    deep: {
      data: [
        "empty",
        "empty.txt",
        "subdir/.dotdir/empty",
        "subdir/subsubdir/empty.txt",
        "subdir-symlink/.dotdir/empty",
        "subdir-symlink/subsubdir/empty.txt",
        "subsubdir-symlink/empty.txt",
      ],
      dirs: [
        "empty",
        "subdir/.dotdir/empty",
        "subdir-symlink/.dotdir/empty",
      ],
      files: [
        "empty.txt",
        "subdir/subsubdir/empty.txt",
        "subdir-symlink/subsubdir/empty.txt",
        "subsubdir-symlink/empty.txt",
      ],
      symlinks: [],
    },
  },

  symlinks: {
    deep: {
      files: [
        "file-symlink.txt",
        "subdir/subsubdir/file-symlink.txt",
        "subdir-symlink/subsubdir/file-symlink.txt",
        "subsubdir-symlink/file-symlink.txt",
      ],
      dirs: [
        "subdir-symlink",
        "subsubdir-symlink",
      ],
    },
  },
};

// Change all the path separators to "\" on Windows
if (path.sep !== "/") {
  changePathSeparatorsRecursive(dir);
}

function changePathSeparatorsRecursive (obj) {
  for (let key of Object.keys(obj)) {
    let value = obj[key];
    if (Array.isArray(value)) {
      obj[key] = value.map(changePathSeparators);
    }
    else if (typeof value === "object") {
      changePathSeparatorsRecursive(value);
    }
  }
}

function changePathSeparators (p) {
  return p.replace(/\//g, path.sep);
}
