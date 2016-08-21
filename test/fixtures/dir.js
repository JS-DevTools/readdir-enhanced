'use strict';

module.exports = {
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
  },
};
