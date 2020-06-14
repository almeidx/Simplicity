import { Message } from 'discord.js';
import {
  SimplicityClient, Listener, CommandHandler,
} from '../../structures';

export default class messageUpdateListener extends Listener {
  /**
   * @param client The client for this listener
   */
  constructor(client: SimplicityClient) {
    super('messageUpdate', client);
  }

  async exec(_: Message, newMessage: Message): Promise<void> {
    CommandHandler.handle(newMessage);
  }
}
