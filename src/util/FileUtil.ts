/* eslint-disable @typescript-eslint/no-unsafe-return */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

/**
 * Contains various file utility methods
 */
export default class FileUtil {
  static readdir = promisify(fs.readdir);

  static readFile = promisify(fs.readFile);

  static stat = promisify(fs.stat);

  /**
   * Requires a directory and it's sub folders
   * @param dirPath The path of the directory
   * @param recursive Whether to require the main directory sub folders
   * @param callback when the require is successful
   * @returns Array with every file in the directories
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async requireDirectory<R = any>(
    dirPath: string,
    recursive = true,
    callback: (
      error: Error | null,
      required: R | null,
      fileName: string,
      pathName: string
    ) => void = () => null,
  ): Promise<Record<string, R>> {
    const files = await FileUtil.readdir(dirPath);
    const filesObject: Record<string, R> = {};
    return Promise.all(
      files.map(async (file) => {
        const fullPath = path.resolve(dirPath, file);
        if (/\.(js|ts|json)$/.test(file)) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const required = (await import(fullPath)).default;
            callback(
              null,
              required,
              file.replace(/.js|.ts|.json/g, ''),
              dirPath.split(/\\|\//g).pop() as string,
            );
            filesObject[file] = required;
            return required;
          } catch (e) {
            callback(e, null, file, dirPath);
          }
        } else if (recursive) {
          const isDirectory = await FileUtil.stat(fullPath).then((f) => f.isDirectory());
          if (isDirectory) {
            return FileUtil.requireDirectory(fullPath, recursive, callback);
          }
        }
        return filesObject[file];
      }),
    ).then(() => filesObject);
  }
}
