'use strict';

const Loader = require('../structures/Loader');

const LOCIZE_AUTH = {
  projectId: process.env.LOCIZE_ID,
  apiKey: process.env.LOCIZE_KEY,
  allowedAddOrUpdateHosts: ['localhost'],
};
const i18next = require('i18next');
const LocizeBackend = require('i18next-node-locize-backend');
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
    const locize = new LocizeBackend(LOCIZE_AUTH, (options) => {
      const connected = await i18next
        .use(translationBackend)
        .use(LocizeBackend)
        .init({
          ...options,
        ns: ['categories', 'commands', 'errors', 'permissions', 'common', 'loggers', 'api_errors'],
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
    });
  }
}

module.exports = LanguagesLoader;
