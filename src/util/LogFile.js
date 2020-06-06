'use strict';

const fs = require('fs');
const path = require('path');

const TMP_PATH = path.resolve(__dirname, '..', '..', 'tmp');
const LOG_FILE_PATH = path.resolve(__dirname, '..', '..', 'tmp', 'log.txt');

class LogFile {
  static createTmpFolder() {
    return fs.mkdirSync(TMP_PATH);
  }

  static async createFile() {
    try {
      await fs.writeFileSync(LOG_FILE_PATH);
    } catch {
      await LogFile.createTmpFolder();
      await LogFile.createFile();
    }
  }

  static async addInfo(info) {
    try {
      await fs.appendFileSync(LOG_FILE_PATH, `${info}\n`);
    } catch {
      await LogFile.createFile();
      await LogFile.addInfo(info);
    }
  }
}

module.exports = LogFile;
