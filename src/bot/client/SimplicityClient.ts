/* eslint-disable class-methods-use-this */
import { Client } from 'discord.js';
import { requireDirectory } from '../../utils/FileUtils';

import * as Logger from '../../utils/Logger';
import handleMessage from './handleMessage';

import '../../discord';

export default class SimplicityClient extends Client {
  public readonly commandMessages: Map<string, string>

  public readonly languages: string[]

  public defaultLanguage: string

  public databaseConnection: boolean

  public constructor(options = {}) {
    super(options);

    this.commandMessages = new Map();
    this.languages = [];
    this.defaultLanguage = 'en-US';

    this.on('message', handleMessage);
    this.on('messageUpdate', (_, msg) => handleMessage.bind(this)(msg));
  }

  async login(token:string = process.env.DISCORD_TOKEN) {
    this.loadInitializers();
    return super.login(token);
  }

  public loadInitializers(): any {
    requireDirectory('src/bot/client/initializers', (err, init, filename) => {
      if (err) {
        this.logger.error(`Não foi possivel importar o arquivo: ${filename}`, err);
        process.exit(1);
      }
      try {
        init.handle(this);
      } catch (error) {
        this.logger.error(`Não foi possivel iniciar o modulo: ${filename}`, error);
        if (init.required) process.exit(1);
      }
    });
  }

  public get logger() {
    return Logger;
  }
}
