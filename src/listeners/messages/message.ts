import { Message } from 'discord.js';
import {
  SimplicityClient, Listener, CommandHandler,
} from '../../structures';

export default class MessageListener extends Listener {
  /**
   * @param client The client for this listener
   */
  constructor(client: SimplicityClient) {
    super('message', client);
  }

  async exec(message: Message): Promise<void> {
    CommandHandler.handle(message);
  }
}
