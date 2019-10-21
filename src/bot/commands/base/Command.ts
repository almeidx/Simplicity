import { MessageTypes } from 'discord.js';
import { CommandOptions, CommandRequirements } from './base';

import HandleRequirements from './handlers/HandleRequirements';
import HandleError from './handlers/HandleError';

export default abstract class Command {
  name: string;
  category: string;
  aliases: string[];
  cooldown: number;
  usersCooldown: Set<string> = new Set();

  constructor(options: CommandOptions, public requirements?: CommandRequirements) {
    this.name = options.name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.cooldown = options.cooldown || Number(process.env.COMMAND_COOLDOWN) || 10000;
  }

  abstract run(message: MessageTypes, ...params: any): any;

  async exec(message: MessageTypes) {
    try {
      await HandleRequirements(this.requirements, message);
      await this.run(message);
    } catch (error) {
      return HandleError(message, error);
    }
  }
}
