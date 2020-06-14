import { Client, Message } from 'discord.js';
import Loaders from '../../loaders';
import Logger from '../../util/Logger';
import * as database from '../../database';
import { CommandCollection } from '..';

/**
 * The main hub for interacting with the Discord API.
 */
export default class SimplicityClient extends Client {
  database?: typeof database
  commands!: CommandCollection
  commandMessages: Map<string, Message> = new Map();

  /**
   * Loads all the loader files
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
   * Logs the client in, establishing a websocket connection to Discord.
   * @param token Token of the account to log in with
   * @returns Token of the account used
   */
  async login(token: string): Promise<string> {
    await this.loadFiles();
    return super.login(token);
  }
}
