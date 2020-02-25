'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class FileUtil {
  static async requireDirectory(dirPath, success, error, recursive = true) {
    const files = await FileUtil.readdir(dirPath);
    const filesObject = {};
    return Promise.all(files.map(async (file) => {
      const fullPath = path.resolve(dirPath, file);
      if (/\.(js|json)$/.test(file)) {
        try {
          const required = require(fullPath);
          if (success) success(required, file.replace(/.js|.json/g, ''), dirPath.split(/\\|\//g).pop());
          filesObject[file] = required;
          return required;
        } catch (e) {
          error(e, file, dirPath);
        }
      } else if (recursive) {
        const isDirectory = await FileUtil.stat(fullPath).then((f) => f.isDirectory());
        if (isDirectory) return FileUtil.requireDirectory(fullPath, success, error);
      }
    })).then(() => filesObject).catch(console.error);
  }
}

module.exports = FileUtil;
module.exports.readdir = promisify(fs.readdir);
module.exports.readFile = promisify(fs.readFile);
module.exports.stat = promisify(fs.stat);
