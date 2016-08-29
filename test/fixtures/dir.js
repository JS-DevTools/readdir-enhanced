'use strict';

var path = require('path');
var isWindows = /^win/.test(process.platform);

// This fake basePath is used to make sure Windows paths are handled properly.
// The drive letter ("C:") is omitted when testing on POSIX systems,
// because it gets interpreted as a path segment
var windowsBasePath = (isWindows ? 'C:' : '') + '\\Windows\\Users\\Desktop';

var dir = module.exports = {
  windowsBasePath: windowsBasePath,

  shallow: {
    data: [
      '.dotdir',
      'empty',
      'subdir',
      'subdir-symlink',
      'subsubdir-symlink',
      'broken-dir-symlink',
      '.dotfile',
      'empty.txt',
      'file.txt',
      'file.json',
      'file-symlink.txt',
      'broken-symlink.txt',
    ],
    dirs: [
      '.dotdir',
      'empty',
      'subdir',
      'subdir-symlink',
      'subsubdir-symlink',
    ],
    files: [
      '.dotfile',
      'empty.txt',
      'file.txt',
      'file.json',
      'file-symlink.txt',
    ],
    symlinks: [
      'subdir-symlink',
      'subsubdir-symlink',
      'broken-dir-symlink',
      'file-symlink.txt',
      'broken-symlink.txt',
    ],
  },

  deep: {
    data: [
      '.dotfile',
      '.dotdir',
      'broken-dir-symlink',
      'broken-symlink.txt',
      'empty',
      'empty.txt',
      'file-symlink.txt',
      'file.json',
      'file.txt',
      'subdir',
      'subdir/.dotdir',
      'subdir/.dotdir/.dotfile',
      'subdir/.dotdir/empty',
      'subdir/file.txt',
      'subdir/subsubdir',
      'subdir/subsubdir/broken-symlink.txt',
      'subdir/subsubdir/empty.txt',
      'subdir/subsubdir/file-symlink.txt',
      'subdir/subsubdir/file.json',
      'subdir/subsubdir/file.txt',
      'subdir-symlink',
      'subdir-symlink/.dotdir',
      'subdir-symlink/.dotdir/.dotfile',
      'subdir-symlink/.dotdir/empty',
      'subdir-symlink/file.txt',
      'subdir-symlink/subsubdir',
      'subdir-symlink/subsubdir/broken-symlink.txt',
      'subdir-symlink/subsubdir/empty.txt',
      'subdir-symlink/subsubdir/file-symlink.txt',
      'subdir-symlink/subsubdir/file.json',
      'subdir-symlink/subsubdir/file.txt',
      'subsubdir-symlink',
      'subsubdir-symlink/broken-symlink.txt',
      'subsubdir-symlink/empty.txt',
      'subsubdir-symlink/file-symlink.txt',
      'subsubdir-symlink/file.json',
      'subsubdir-symlink/file.txt',
    ],
    dirs: [
      '.dotdir',
      'empty',
      'subdir',
      'subdir/.dotdir',
      'subdir/.dotdir/empty',
      'subdir/subsubdir',
      'subdir-symlink',
      'subdir-symlink/.dotdir',
      'subdir-symlink/.dotdir/empty',
      'subdir-symlink/subsubdir',
      'subsubdir-symlink',
    ],
    files: [
      'subdir/file.txt',
      'subdir/.dotdir/.dotfile',
      'subdir/subsubdir/empty.txt',
      'subdir/subsubdir/file.txt',
      'subdir/subsubdir/file.json',
      'subdir/subsubdir/file-symlink.txt',
      'subdir-symlink/file.txt',
      'subdir-symlink/.dotdir/.dotfile',
      'subdir-symlink/subsubdir/empty.txt',
      'subdir-symlink/subsubdir/file.txt',
      'subdir-symlink/subsubdir/file.json',
      'subdir-symlink/subsubdir/file-symlink.txt',
      'subsubdir-symlink/empty.txt',
      'subsubdir-symlink/file.txt',
      'subsubdir-symlink/file.json',
      'subsubdir-symlink/file-symlink.txt',
      '.dotfile',
      'empty.txt',
      'file.txt',
      'file.json',
      'file-symlink.txt',
    ],
    symlinks: [
      'subdir/subsubdir/broken-symlink.txt',
      'subdir/subsubdir/file-symlink.txt',
      'subdir-symlink',
      'subdir-symlink/subsubdir/broken-symlink.txt',
      'subdir-symlink/subsubdir/file-symlink.txt',
      'subsubdir-symlink',
      'subsubdir-symlink/broken-symlink.txt',
      'subsubdir-symlink/file-symlink.txt',
      'broken-dir-symlink',
      'file-symlink.txt',
      'broken-symlink.txt',
    ],

    oneLevel: {
      data: [
        '.dotfile',
        '.dotdir',
        'broken-dir-symlink',
        'broken-symlink.txt',
        'empty',
        'empty.txt',
        'file-symlink.txt',
        'file.json',
        'file.txt',
        'subdir',
        'subdir/.dotdir',
        'subdir/file.txt',
        'subdir/subsubdir',
        'subdir-symlink',
        'subdir-symlink/.dotdir',
        'subdir-symlink/file.txt',
        'subdir-symlink/subsubdir',
        'subsubdir-symlink',
        'subsubdir-symlink/broken-symlink.txt',
        'subsubdir-symlink/empty.txt',
        'subsubdir-symlink/file-symlink.txt',
        'subsubdir-symlink/file.json',
        'subsubdir-symlink/file.txt',
      ],
      dirs: [
        '.dotdir',
        'empty',
        'subdir',
        'subdir/.dotdir',
        'subdir/subsubdir',
        'subdir-symlink',
        'subdir-symlink/.dotdir',
        'subdir-symlink/subsubdir',
        'subsubdir-symlink',
      ],
      files: [
        'subdir/file.txt',
        'subdir-symlink/file.txt',
        'subsubdir-symlink/empty.txt',
        'subsubdir-symlink/file.txt',
        'subsubdir-symlink/file.json',
        'subsubdir-symlink/file-symlink.txt',
        '.dotfile',
        'empty.txt',
        'file.txt',
        'file.json',
        'file-symlink.txt',
      ],
      symlinks: [
        'subdir-symlink',
        'subsubdir-symlink',
        'subsubdir-symlink/broken-symlink.txt',
        'subsubdir-symlink/file-symlink.txt',
        'broken-dir-symlink',
        'file-symlink.txt',
        'broken-symlink.txt',
      ],
    },
  },

  subdir: {
    shallow: {
      data: [
        '.dotdir',
        'subsubdir',
        'file.txt',
      ],
      dirs: [
        '.dotdir',
        'subsubdir',
      ],
      files: [
        'file.txt',
      ],
      symlinks: [],
    },

    deep: {
      data: [
        '.dotdir',
        '.dotdir/.dotfile',
        '.dotdir/empty',
        'file.txt',
        'subsubdir',
        'subsubdir/broken-symlink.txt',
        'subsubdir/empty.txt',
        'subsubdir/file-symlink.txt',
        'subsubdir/file.json',
        'subsubdir/file.txt',
      ],
      dirs: [
        '.dotdir',
        '.dotdir/empty',
        'subsubdir',
      ],
      files: [
        '.dotdir/.dotfile',
        'file.txt',
        'subsubdir/empty.txt',
        'subsubdir/file-symlink.txt',
        'subsubdir/file.json',
        'subsubdir/file.txt',
      ],
      symlinks: [
        'subsubdir/broken-symlink.txt',
        'subsubdir/file-symlink.txt',
      ],
    },

    txt: {
      shallow: {
        data: [
          'file.txt',
        ],
        dirs: [],
        files: [
          'file.txt',
        ],
        symlinks: [],
      },

      deep: {
        data: [
          'file.txt',
          'subsubdir/broken-symlink.txt',
          'subsubdir/empty.txt',
          'subsubdir/file-symlink.txt',
          'subsubdir/file.txt',
        ],
        dirs: [],
        files: [
          'file.txt',
          'subsubdir/empty.txt',
          'subsubdir/file-symlink.txt',
          'subsubdir/file.txt',
        ],
        symlinks: [
          'subsubdir/broken-symlink.txt',
          'subsubdir/file-symlink.txt',
        ],
      },
    },

    subsubdir: {
      data: [
        'broken-symlink.txt',
        'empty.txt',
        'file-symlink.txt',
        'file.json',
        'file.txt',
      ],
      dirs: [],
      files: [
        'empty.txt',
        'file-symlink.txt',
        'file.json',
        'file.txt',
      ],
      symlinks: [
        'broken-symlink.txt',
        'file-symlink.txt',
      ],

      txt: {
        data: [
          'broken-symlink.txt',
          'empty.txt',
          'file-symlink.txt',
          'file.txt',
        ],
        dirs: [],
        files: [
          'empty.txt',
          'file-symlink.txt',
          'file.txt',
        ],
        symlinks: [
          'broken-symlink.txt',
          'file-symlink.txt',
        ],

        windowsStyle: {
          fromDir: {
            data: [
              'subdir\\subsubdir\\broken-symlink.txt',
              'subdir\\subsubdir\\empty.txt',
              'subdir\\subsubdir\\file-symlink.txt',
              'subdir\\subsubdir\\file.txt',
            ],
            dirs: [],
            files: [
              'subdir\\subsubdir\\empty.txt',
              'subdir\\subsubdir\\file-symlink.txt',
              'subdir\\subsubdir\\file.txt',
            ],
            symlinks: [
              'subdir\\subsubdir\\broken-symlink.txt',
              'subdir\\subsubdir\\file-symlink.txt',
            ],
          },

          fromRoot: {
            data: [
              windowsBasePath + '\\subdir\\subsubdir\\broken-symlink.txt',
              windowsBasePath + '\\subdir\\subsubdir\\empty.txt',
              windowsBasePath + '\\subdir\\subsubdir\\file-symlink.txt',
              windowsBasePath + '\\subdir\\subsubdir\\file.txt',
            ],
            dirs: [],
            files: [
              windowsBasePath + '\\subdir\\subsubdir\\empty.txt',
              windowsBasePath + '\\subdir\\subsubdir\\file-symlink.txt',
              windowsBasePath + '\\subdir\\subsubdir\\file.txt',
            ],
            symlinks: [
              windowsBasePath + '\\subdir\\subsubdir\\broken-symlink.txt',
              windowsBasePath + '\\subdir\\subsubdir\\file-symlink.txt',
            ],
          },
        }
      },
    }
  },

  txt: {
    shallow: {
      data: [
        'empty.txt',
        'file.txt',
        'file-symlink.txt',
        'broken-symlink.txt',
      ],
      dirs: [],
      files: [
        'empty.txt',
        'file.txt',
        'file-symlink.txt',
      ],
      symlinks: [
        'file-symlink.txt',
        'broken-symlink.txt',
      ],
    },

    deep: {
      data: [
        'broken-symlink.txt',
        'empty.txt',
        'file-symlink.txt',
        'file.txt',
        'subdir/file.txt',
        'subdir/subsubdir/broken-symlink.txt',
        'subdir/subsubdir/empty.txt',
        'subdir/subsubdir/file-symlink.txt',
        'subdir/subsubdir/file.txt',
        'subdir-symlink/file.txt',
        'subdir-symlink/subsubdir/broken-symlink.txt',
        'subdir-symlink/subsubdir/empty.txt',
        'subdir-symlink/subsubdir/file-symlink.txt',
        'subdir-symlink/subsubdir/file.txt',
        'subsubdir-symlink/broken-symlink.txt',
        'subsubdir-symlink/empty.txt',
        'subsubdir-symlink/file-symlink.txt',
        'subsubdir-symlink/file.txt',
      ],
      dirs: [],
      files: [
        'subdir/file.txt',
        'subdir/subsubdir/empty.txt',
        'subdir/subsubdir/file.txt',
        'subdir/subsubdir/file-symlink.txt',
        'subdir-symlink/file.txt',
        'subdir-symlink/subsubdir/empty.txt',
        'subdir-symlink/subsubdir/file.txt',
        'subdir-symlink/subsubdir/file-symlink.txt',
        'subsubdir-symlink/empty.txt',
        'subsubdir-symlink/file.txt',
        'subsubdir-symlink/file-symlink.txt',
        'empty.txt',
        'file.txt',
        'file-symlink.txt',
      ],
      symlinks: [
        'subdir/subsubdir/broken-symlink.txt',
        'subdir/subsubdir/file-symlink.txt',
        'subdir-symlink/subsubdir/broken-symlink.txt',
        'subdir-symlink/subsubdir/file-symlink.txt',
        'subsubdir-symlink/broken-symlink.txt',
        'subsubdir-symlink/file-symlink.txt',
        'file-symlink.txt',
        'broken-symlink.txt',
      ],
    },
  },

  empties: {
    shallow: {
      data: [
        'empty',
        'empty.txt',
      ],
      dirs: [
        'empty',
      ],
      files: [
        'empty.txt',
      ],
      symlinks: [],
    },

    deep: {
      data: [
        'empty',
        'subdir/.dotdir/empty',
        'subdir/subsubdir/empty.txt',
        'subdir-symlink/.dotdir/empty',
        'subdir-symlink/subsubdir/empty.txt',
        'subsubdir-symlink/empty.txt',
        'empty.txt',
      ],
      dirs: [
        'empty',
        'subdir/.dotdir/empty',
        'subdir-symlink/.dotdir/empty',
      ],
      files: [
        'subdir/subsubdir/empty.txt',
        'subdir-symlink/subsubdir/empty.txt',
        'subsubdir-symlink/empty.txt',
        'empty.txt',
      ],
      symlinks: [],
    },
  },

  symlinks: {
    deep: {
      files: [
        'subdir/subsubdir/file-symlink.txt',
        'subdir-symlink/subsubdir/file-symlink.txt',
        'subsubdir-symlink/file-symlink.txt',
        'file-symlink.txt',
      ],
      dirs: [
        'subdir-symlink',
        'subsubdir-symlink',
      ],
    },
  },
};

// Change all the path separators to "\" on Windows
if (path.sep !== '/') {
  changePathSeparators(dir);
}

function changePathSeparators(obj) {
  Object.keys(obj).forEach(function(key) {
    var value = obj[key];
    if (Array.isArray(value)) {
      obj[key] = value.map(function(p) {
        return p.replace(/\//g, path.sep);
      });
    }
    else if (typeof value === 'object') {
      changePathSeparators(value);
    }
  });
}