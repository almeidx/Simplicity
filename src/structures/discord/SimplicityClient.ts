/* eslint-disable @typescript-eslint/await-thenable */

import { Client, ClientOptions } from 'discord.js';
import Loaders from '../../loaders';
import Logger from '../../util/Logger';
import * as database from '../../database';

/**
 * Main Client class
 */
class SimplicityClient extends Client {
  database?: typeof database
  /**
   * Loads all the loader files
   * @returns
   */
  async loadFiles(): Promise<void> {
    for (const loader of Loaders(this)) {
      let result;
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await loader.load();
        Logger.log(`${loader.constructor.name} carregou sem problemas!`);
      } catch (err) {
        Logger.error('ops', err);
        result = false;
      } finally {
        if (!result && loader.required) process.exit(1);
      }
    }
  }

  /**
   * Login the Client
   * @param token The API Token
   * @returns The Client after being logged in
   */
  async login(token: string): Promise<string> {
    await this.loadFiles();
    return super.login(token);
  }
}

export default SimplicityClient;
