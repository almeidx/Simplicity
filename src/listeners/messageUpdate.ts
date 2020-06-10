import { Message } from 'discord.js';
import {
  SimplicityClient, SimplicityListener, CommandHandler,
} from '../structures';

export default class messageUpdateListener extends SimplicityListener {
  constructor(client: SimplicityClient) {
    super('messageUpdate', client);
  }

  async exec(_: Message, newMessage: Message): Promise<void> {
    CommandHandler.handle(newMessage, true);
  }
}
