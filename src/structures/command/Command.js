'use strict';

const CommandRequirements = require('./CommandRequirements');
const CommandCooldown = require('./CommandCooldown');
const CommandError = require('./CommandError');

class Command {
  constructor(client, options = {}) {
    this.client = client;
    this.setup(options);
  }

  setup(options) {
    if (!options.name) throw new Error(`${this.constructor.name} doesn't have name`);
    if (!options.category) throw new Error(`${this.constructor.name} doesn't have category`);


    this.name = options.name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.requirements = options.requirements;
    this.argRequireResponse = options.argRequiredResponse;
    this.subcommands = options.subcommands || [];
    this.cooldown = options.cooldown || process.env.COMMAND_COOLDOWN || 10000;
    this.usersCooldown = this.cooldown > 0 ? new CommandCooldown(this.cooldown) : null;
  }

  run() {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }

  async _run(ctx) {
    let inCooldown = true;
    try {
      if (this.usersCooldown) {
        const cooldown = await this.runCooldown(ctx.author.id, ctx.t);
        if (cooldown === 'continue') inCooldown = false;
        if (cooldown === 'ratelimit') return;
      }

      const [subcmd] = ctx.args;
      const subcommand = subcmd && this.getSubCommand(subcmd.toLowerCase());
      if (subcommand) return await this.runSubCommand(subcommand, ctx);

      if (this.requirements) {
        await CommandRequirements.handle(ctx, this.requirements, this.argRequireResponse);
      }

      await this.run(ctx);
    } catch (error) {
      this.client.emit('commandError', error, ctx);
    } finally {
      if (this.usersCooldown && !inCooldown) this.usersCooldown.add(ctx.author.id);
    }
  }

  runCooldown(userID, t) {
    const isCooldown = this.usersCooldown.isCooldown(userID);
    if (isCooldown === 'continue') return 'continue';
    else if (isCooldown === 'ratelimit') return 'ratelimit';
    else throw new CommandError(this.usersCooldown.toMessage(isCooldown, t));
  }

  getSubCommand(name) {
    return this.subcommands.find((i) => i.name === name || (Array.isArray(i.aliases) && i.aliases.includes(name)));
  }

  runSubCommand(subcommand, context) {
    context.query = context.query.replace(`${context.args[0]} `, '').slice(1);
    context.args = context.args.slice(1);
    return subcommand._run(context);
  }
}

module.exports = Command;
