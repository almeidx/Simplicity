
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import i18next from 'i18next';
import translationBackend from 'i18next-node-fs-backend';
import { Logger } from '../util';
import { SimplicityClient, Loader } from '../structures';

const readdir = promisify(fs.readdir);
const pathFolder = path.resolve('src', 'locales');

class LanguagesLoader extends Loader {
  constructor(client: SimplicityClient) {
    super(client, true);
  }

  async load(): Promise<boolean> {
    const connected = await i18next
      .use(translationBackend)
      .init({
        backend: { loadPath: `${pathFolder}/{{lng}}/{{ns}}.json` },
        defaultNS: 'commands',
        fallbackLng: 'en-US',
        interpolation: { escapeValue: false },
        ns: ['categories', 'commands', 'errors', 'permissions', 'common', 'loggers', 'api_errors'],
        preload: await readdir(pathFolder),
        returnEmptyString: false,
      })
      .catch((error) => Logger.error(error));
    return !!connected;
  }
}
export default LanguagesLoader;
