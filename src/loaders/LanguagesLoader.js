'use strict';

const Loader = require('../structures/Loader');

const i18next = require('i18next');
const translationBackend = require('i18next-node-fs-backend');

const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);


const Path = require('path');
const path = Path.join(__dirname, '../locales');

class LanguagesLoader extends Loader {
  constructor(client) {
    super(client, true);
  }

  async load() {
    const connected = await i18next
      .use(translationBackend)
      .init({
        ns: ['categories', 'commands', 'errors', 'permissions', 'common', 'loggers', 'errorsAPI'],
        preload: await readdir(path),
        fallbackLng: 'en-US',
        defaultNS: 'commands',
        backend: {
          loadPath: `${path}/{{lng}}/{{ns}}.json`,
        },
        interpolation: { escapeValue: false },
        returnEmptyString: false,
      }, () => {
        console.log(Object.keys(i18next.store.data));
      })
      .then(() => true)
      .catch(console.error);
    return connected;
  }
}

module.exports = LanguagesLoader;
