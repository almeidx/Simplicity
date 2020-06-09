/* eslint-disable consistent-return */
import i18next, { TFunction } from 'i18next';
import Config from '../../config';
import { PermissionUtil, Util } from '../../util';
// import CommandCollection from './CommandCollection'
import CommandError from './CommandError';
import CommandRequirements, { CommandRequirementOpts } from './CommandRequirements';
import CommandParameters from './arguments/CommandParameter';
import CommandCooldown, { CooldownTypes } from './cooldown/CommandCooldown';
import DefaultFlags from './arguments/DefaultFlags';
import SimplicityClient from '../discord/SimplicityClient';
import CommandContext from './CommandContext';

import { ParameterOptsTypes, FlagOptions, CommandParameter } from './arguments/ArgumentOptions.interfances';

type CommandCategories = 'bot' | 'dev';

interface CommandOptions {
  category: CommandCategories;
  aliases?: string[];
  requirements?: Partial<CommandRequirementOpts>;
  cooldown?: number;
  args?: ParameterOptsTypes[];
  flags?: (ParameterOptsTypes & FlagOptions)[]
}

export default abstract class Command {
  client: SimplicityClient;
  name: string;
  aliases: string[];
  category: CommandCategories;
  requirements: CommandRequirementOpts;
  cooldown: number;
  args: CommandParameter[];
  flags: CommandParameter[];
  usersCooldown?: CommandCooldown;
  usagePath?: string;
  examplesPath?: string;

  constructor(client: SimplicityClient, name: string, options: CommandOptions) {
    this.client = client;
    this.name = name;
    this.category = options.category;
    this.aliases = options.aliases ?? [];
    this.requirements = CommandRequirements.parseOptions(options.requirements ?? {});
    this.cooldown = options.cooldown ?? Config.COMMAND_COOLDOWN;
    this.args = options.args?.map((arg) => CommandParameters.normalizeParam(arg)) ?? [];
    this.flags = options.flags?.map((flag) => CommandParameters.normalizeParam(flag)) ?? [];

    this.flags.push(...DefaultFlags);

    if (this.cooldown) {
      this.usersCooldown = new CommandCooldown(this.cooldown);
    }

    if (i18next.exists(`commands:${this.name}.usage`)) {
      this.usagePath = `commands:${this.name}.usage`;
    }
    if (i18next.exists(`commands:${this.name}.examples`)) {
      this.examplesPath = `commands:${this.name}.examples`;
    }
  }

  abstract run(ctx: CommandContext, ...args: any[]): any

  getUsage(t: TFunction): string {
    return this.usagePath ? t(this.usagePath) : '';
  }

  async handle(ctx: CommandContext): Promise<void> {
    let inCooldown = true;
    const isDev = PermissionUtil.verifyDev(ctx.author.id, ctx.client);
    try {
      if (!isDev && this.usersCooldown) {
        const cooldown = await this.runCooldown(ctx.author.id, ctx.t);
        if (cooldown === CooldownTypes.CONTINUE) inCooldown = false;
        if (cooldown === CooldownTypes.RATE_LIMIT) return;
      }

      // const [subcmd] = ctx.args;
      // const subcommand = subcmd && this.findSubCommand(subcmd.toLowerCase());
      // if (subcommand) return await this.runSubCommand(subcommand, ctx);

      if (this.requirements) {
        await CommandRequirements.handle(ctx, this.requirements);
      }

      if (!Util.isEmpty(this.flags)) {
        const flags = await CommandParameters.handleFlags(ctx, this.flags);
        if (typeof flags === 'function') {
          await flags(ctx);
          return;
        }
        ctx.flags = flags;
      }

      let args = [];
      if (!Util.isEmpty(this.args)) {
        args = await CommandParameters.handleArguments(ctx, this.args);
      }

      await this.run(ctx, ...args);
    } catch (error) {
      CommandError.handle(error, ctx);
    } finally {
      if (!isDev && this.usersCooldown && !inCooldown) {
        this.usersCooldown.add(ctx.author.id);
      }
    }
  }

  runCooldown(userID: string, t: TFunction): CooldownTypes | void {
    if (!this.usersCooldown) return;
    const cooldown = this.usersCooldown.handle(userID);
    if (cooldown === CooldownTypes.CONTINUE) return CooldownTypes.CONTINUE;
    if (cooldown === CooldownTypes.RATE_LIMIT) return CooldownTypes.RATE_LIMIT;
    throw new CommandError(CommandCooldown.getMessage(cooldown, t), { notEmbed: true });
  }

  // findSubCommand(name) {
  //   return this.subcommands.find(name.toLowerCase());
  // }

  // registerSubCommand(SubCommand, customOptions = {}) {
  //   const subcommand = new SubCommand(this.client);
  //   subcommand.setOptions(customOptions);
  //   this.subcommands.register(subcommand);
  // }

  // runSubCommand(subcommand, context) {
  //   context.query = context.query.replace(`${context.args[0]} `, '').slice(1);
  //   context.args = context.args.slice(1);
  //   return subcommand.handle(context);
  // }
}
