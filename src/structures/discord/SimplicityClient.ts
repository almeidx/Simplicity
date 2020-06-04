
import { Client } from 'discord.js';
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
      try {
        await loader.load();
        Logger.log(`${loader.constructor.name} carregou sem problemas!`);
      } catch (err) {
        Logger.error('ops', err);
        if (loader.required) process.exit(1);
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
