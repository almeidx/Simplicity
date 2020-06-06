'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const Loader = require('@structures/Loader');
const Logger = require('@util/Logger');
const i18next = require('i18next');
const translationBackend = require('i18next-node-fs-backend');
const readdir = promisify(fs.readdir);

const pathFolder = path.resolve('src', 'locales');
class LanguagesLoader extends Loader {
  constructor(client) {
    super(client, true);
  }

  async load() {
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
      }, () => {
        Logger.log(Object.keys(i18next.store.data));
      })
      .then(() => true)
      .catch(Logger.error);
    return connected;
  }
}

module.exports = LanguagesLoader;
