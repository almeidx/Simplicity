import i18n from 'i18next';
import translationBackend from 'i18next-node-fs-backend';
import path from 'path';
import { readdirSync } from 'fs';

import SimplicityClient from '../SimplicityClient';

const localesPath = path.resolve('src/locales');
export const required = true;
export async function handle(client: SimplicityClient) {
  return i18n
    .use(translationBackend)
    .init({
      ns: ['categories', 'commands', 'errors', 'permissions', 'common', 'loggers', 'api_errors'],
      preload: readdirSync(localesPath),
      fallbackLng: client.defaultLanguage,
      defaultNS: 'commands',
      backend: {
        loadPath: `${path}/{{lng}}/{{ns}}.json`,
      },
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    }, () => {
      if (i18n.options.preload) {
        i18n.options.preload.forEach((lng) => client.languages.push(lng));
      }
      client.logger.log('Todas linguas disponiveis:', client.languages.join(', '));
    });
}
