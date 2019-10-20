/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable lines-between-class-members */
import { Message } from 'discord.js';
import { CommandOptions, CommandRequirements, ParamsOptions } from './interface';

export default class Command {
    name: string;
    category: string;
    aliases: string[];
    cooldown: string | number;
    usersCooldown: Set<string>;
    requirements: CommandRequirements;
    params: ParamsOptions[];

    constructor(options: CommandOptions, requirements: CommandRequirements, params: ParamsOptions[]) {
      this.name = options.name;
      this.category = options.category;
      this.aliases = options.aliases || [];
      this.cooldown = options.cooldown || process.env.COMMAND_COOLDOWN || 10000;
      this.usersCooldown = this.cooldown && new Set();
      this.requirements = requirements || {};
      this.params = params || [];
    }

    run(message: Message, ...params: any): any {
      throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    }

    async exec(message: Message) {
      try {
        await this.handleCooldown(message);
      } catch (error) {
        return error;
      }

      try {
        await this.handleSubCommand(message);
      } catch (error) {
        return error;
      }

      try {
        await this.handleRequirements(message);
      } catch (error) {
        return error;
      }

      let params = [];
      try {
        params = await this.handleArguments(message);
      } catch (error) {
        return error;
      }

      try {
        await this.run(message, params);
      } catch (error) {
        return error;
      }
    }

    handleCooldown(message: Message): any {}

    handleSubCommand(message: Message): any {}

    handleRequirements(message: Message): any {}

    handleArguments(message: Message): any {}
}
