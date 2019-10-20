/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable lines-between-class-members */
import { Message, TextChannel } from 'discord.js';
import SimplicityClient from '../../client/SimplicityClient';
import { CommandOptions, CommandRequirements, ParamsOptions } from './interface';

import { isDeveloper, notHavePermissions } from './utils/Utils';
import { CommandBaseError } from './utils/CommndError';

export default class Command {
    client: SimplicityClient;
    name: string;
    category: string;
    aliases: string[];
    cooldown: string | number;
    usersCooldown: Set<string>;
    requirements: CommandRequirements;
    params: ParamsOptions[];

    constructor(
      client: SimplicityClient, options: CommandOptions,
      requirements: CommandRequirements, params: ParamsOptions[],
    ) {
      this.client = client;
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
      /*
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
      */

      try {
        await this.handleRequirements(message);
      } catch (error) {
        return error;
      }
      /*
      let params = [];
      try {
        params = await this.handleArguments(message);
      } catch (error) {
        return error;
      }
      */

      try {
        await this.run(message, []);
      } catch (error) {
        return error;
      }
    }

    handleCooldown(message: Message): any {}

    handleSubCommand(message: Message): any {}

    handleRequirements(message: Message): any {
      const {
        ownerOnly, requireDatabase, guildOnly, userPermissions, clientPermissions,
      } = this.requirements;

      const { author, client, channel } = message;
      if (ownerOnly && !isDeveloper(author.id, client)) {
        throw new CommandBaseError('requirements', 'errors:developerOnly');
      }

      if (guildOnly && channel.type === 'dm') {
        throw new CommandBaseError('requirements', 'errors:guildOnly');
      }

      if (requireDatabase && !client.databaseConnection) {
        throw new CommandBaseError('requirements', 'errors:requireDatabase');
      }

      if (channel instanceof TextChannel) {
        const uPermissions = userPermissions && notHavePermissions(userPermissions, channel, author);
        if (uPermissions) {
          throw new CommandBaseError('requirements', 'errors:userMissingPermission');
        }
        const cPermissions = clientPermissions && notHavePermissions(clientPermissions, channel, client.user);
        if (cPermissions) {
          throw new CommandBaseError('requirements', 'errors:clientMissingPermission');
        }
      }
    }

    handleArguments(message: Message): any {}
}
