import { Message } from 'discord.js';
import Command from './base/Command';

export default class TestCommand extends Command {
  constructor() {
    super({
      name: 'test',
      category: 'devolepers',
    });
  }

  run(message: Message) {
    return message.send('kkk');
  }
}
