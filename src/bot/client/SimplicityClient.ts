/* eslint-disable class-methods-use-this */
import { Client } from 'discord.js';
import { requireDirectory } from '../../utils/FileUtils';
import * as Logger from '../../utils/Logger';

export default class SimplicityClient extends Client {
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
