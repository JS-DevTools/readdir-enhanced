'use strict';

exports.shallow = [
  '.dotdir',
  'empty',
  'subdir',
  'subdir-symlink',
  'subsubdir-symlink',
  '.dotfile',
  'empty.txt',
  'file.txt',
  'file.json',
  'file-symlink.txt',
  'broken-symlink.txt',
];

exports.deep = [
  '.dotdir',
  'empty',
  'subdir/.dotdir/empty',
  'subdir/.dotdir/.dotfile',
  'subdir/file.txt',
  'subdir-symlink/.dotdir/empty',
  'subdir-symlink/.dotdir/.dotfile',
  'subdir-symlink/file.txt',
  'subdir-alias',
  '.dotfile',
  'empty.txt',
  'file.txt',
  'file.json',
  'file-alias.txt',
  'file-symlink.txt',
  'broken-symlink.txt',
];
