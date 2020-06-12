import { Message } from 'discord.js';
import {
  SimplicityClient, SimplicityListener, CommandHandler,
} from '../../structures';

export default class MessageListener extends SimplicityListener {
  constructor(client: SimplicityClient) {
    super('message', client);
  }

  async exec(message: Message): Promise<void> {
    CommandHandler.handle(message);
  }
}
