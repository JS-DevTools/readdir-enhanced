'use strict';

module.exports = {
  shallow: {
    all: [
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

  subdir: {
    shallow: {
      all: [
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
  },
};
