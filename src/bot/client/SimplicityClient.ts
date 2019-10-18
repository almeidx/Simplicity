import { Client } from 'discord.js';
import { requireDirectory } from '../../utils/FileUtils';

export default class SimplicityClient extends Client {
  async login(token:string = process.env.DISCORD_TOKEN) {
    this.loadInitializers();
    return super.login(token);
  }

  loadInitializers(): any {
    requireDirectory('src/bot/client/initializers', (err, init) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      try {
        init.handle(this);
      } catch (error) {
        console.error(error);
        if (init.required) process.exit(1);
      }
    });
  }

  private timestamp() {
    return this;
  }
}
