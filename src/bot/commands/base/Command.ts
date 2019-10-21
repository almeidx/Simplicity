import { MessageTypes } from 'discord.js';
import { CommandOptions, CommandRequirements, ParameterOptions } from './base';

import HandleRequirements from './handlers/HandleRequirements';
import HandleArguments from './handlers/HandleArguments';
import HandleError from './handlers/HandleError';


export default abstract class Command {
  readonly name: string;
  readonly category: string;
  readonly aliases: string[];
  private cooldown: number;
  private usersCooldown: Set<string> = new Set();

  constructor(
    options: CommandOptions,
    readonly requirements?: CommandRequirements,
    readonly params?: ParameterOptions[],
  ) {
    this.name = options.name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.cooldown = options.cooldown || Number(process.env.COMMAND_COOLDOWN) || 10000;
  }

  abstract run(message: MessageTypes, ...params: any): any;

  async exec(message: MessageTypes) {
    try {
      await HandleRequirements(this.requirements, message);
      const parameters = this.params ? await HandleArguments(this.params, message) : [];
      await this.run(message, ...parameters);
    } catch (error) {
      return HandleError(message, error);
    }
  }
}
