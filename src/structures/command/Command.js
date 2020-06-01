'use strict';

const { COMMAND_COOLDOWN } = require('@data/config');
const { PermissionUtil: { verifyDev }, Util: { isEmpty } } = require('@util');
const i18next = require('i18next');
const CommandError = require('./CommandError');
const CommandRequirements = require('./CommandRequirements');
const CommandParameters = require('./arguments/CommandArguments');
const { CommandCooldown, CooldownTypes } = require('./cooldown/CommandCooldown');
const defaultFlags = require('./defaultFlags');

class Command {
  constructor(client, name, options = {}) {
    this.client = client;
    this.setup(name, options);
  }

  setup(name, options) {
    if (!name) throw new Error(`${this.constructor.name} doesn't have name`);
    if (!options.category) throw new Error(`${this.constructor.name} doesn't have category`);

    this.name = name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.requirements = CommandRequirements.parseOptions(options.requirements);
    this.subcommands = options.subcommands || [];
    this.cooldown = options.cooldown || COMMAND_COOLDOWN || 10000;
    this.usersCooldown = this.cooldown > 0 ? new CommandCooldown(this.cooldown) : null;

    this.args = CommandParameters.parseOptions(options.args || []);

    const flags = options.flags || [];
    flags.push(...defaultFlags);
    this.flags = CommandParameters.parseOptions(flags);

    const strUsage = `commands:${this.name}.usage`;
    this.usagePath = i18next.exists(strUsage) ? strUsage : null;
    const strExamples = `commands:${this.name}.examples`;
    this.examplesPath = i18next.exists(strExamples) ? strExamples : null;
  }

  getUsage(t) {
    return this.usagePath ? t(this.usagePath) : '';
  }

  run() {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }

  async handle(ctx, args) {
    let inCooldown = true;
    const isDev = verifyDev(ctx.author.id, ctx.client);
    try {
      if (!isDev && this.usersCooldown) {
        const cooldown = await this.runCooldown(ctx.author.id, ctx.t);
        if (cooldown === CooldownTypes.CONTINUE) inCooldown = false;
        if (cooldown === CooldownTypes.RATE_LIMIT) return;
      }

      const [subcmd] = ctx.args;
      const subcommand = subcmd && this.findSubCommand(subcmd.toLowerCase());
      if (subcommand) return await this.runSubCommand(subcommand, ctx);

      if (this.requirements) {
        await CommandRequirements.handle(ctx, this.requirements, this.argRequireResponse);
      }

      if (!isEmpty(this.flags)) {
        const flags = await CommandParameters.handleFlags(ctx, this.flags);
        if (typeof flags === 'function') {
          await flags(ctx);
          return;
        }
        ctx.flags = flags;
      }

      if (!isEmpty(this.args)) {
        args = await CommandParameters.handleArguments(ctx, this.args);
      }

      await this.run(ctx, ...args);
    } catch (error) {
      this.client.emit('commandError', error, ctx);
    } finally {
      if (!isDev && this.usersCooldown && !inCooldown) this.usersCooldown.add(ctx.author.id);
    }
  }

  runCooldown(userID, t) {
    const cooldown = this.usersCooldown.handle(userID);
    if (cooldown === CooldownTypes.CONTINUE) return CooldownTypes.CONTINUE;
    else if (cooldown === CooldownTypes.RATE_LIMIT) return CooldownTypes.RATE_LIMIT;
    else throw new CommandError(CommandCooldown.getMessage(cooldown, t), { notEmbed: true });
  }

  findSubCommand(name) {
    return this.subcommands.find((i) => i.name === name || (Array.isArray(i.aliases) && i.aliases.includes(name)));
  }

  runSubCommand(subcommand, context) {
    context.query = context.query.replace(`${context.args[0]} `, '').slice(1);
    context.args = context.args.slice(1);
    return subcommand.handle(context);
  }
}

module.exports = Command;
