import { resolve } from 'path';
import { readdirSync, lstatSync } from 'fs';

type callback = (error: Error | null, module: any, filename?: string) => void;

export function requireDirectory(
  dirPath: string,
  ignore: string[] | callback,
  callback?: callback | null,
): void {
  const files = readdirSync(resolve(dirPath));
  return files.forEach(async (filename): Promise<void> => {
    const fullPath = resolve(`${dirPath}/${filename}`);

    const filenames = Array.isArray(ignore) ? ignore : [];
    const ignores = ['interface', ...filenames];
    const checkIgnore = ignores.some((i) => filename.includes(i.toLowerCase()));
    if (checkIgnore) return;

    if (lstatSync(fullPath).isDirectory()) {
      return requireDirectory(fullPath, ignore, callback);
    }

    if (!filename.endsWith('.ts')) return;

    let fn = callback;
    if (typeof ignore === 'function') fn = ignore;
    if (!ignore && typeof callback !== 'function') fn = (() => {});
    try {
      const result = await import(fullPath);
      fn(null, result.default ? result.default : result);
    } catch (error) {
      fn(error, null);
    }
  });
}
