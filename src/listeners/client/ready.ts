import { Embed, Listener, SimplicityClient } from '../../structures';
import Logger from '../../util/Logger';

export default class ReadyListener extends Listener {
  constructor(client: SimplicityClient) {
    super('ready', client);
  }

  exec(): void {
    const message = `Logged on ${this.client.guilds.cache.size} guilds and ${this.client.users.cache.size} users`;

    Logger.log(`[Ready] ${message}`);

    this.sendPrivateMessage('BOT_LOG',
      new Embed(this.client.user, { autoFooter: false })
        .setColor('GREEN')
        .setDescription(message));
  }
}
