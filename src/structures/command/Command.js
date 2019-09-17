'use strict';

const Requirements = require('./Requirements');
const RunStore = require('./stores/RunStore');
const CommandCooldown = require('./CommandCooldown');
const CommandError = require('./CommandError');

class Command {
  constructor(client, options = {}) {
    this.client = client;
    this.setup(options);
  }

  setup(options) {
    this.name = options.name || 'none';
    this.category = options.category || 'none';
    this.aliases = options.aliases || [];
    this.requirements = options.requirements;
    this.responses = options.responses || {};
    this.subcommands = options.subcommands || [];
    this.cooldown = options.cooldown || process.env.COMMAND_COOLDOWN || 10000;
    this.running = new RunStore();
    this.usersCooldown = new CommandCooldown(this.cooldown);
  }

  // eslint-disable-next-line no-empty-function
  async run() {}

  async _run(context) {
    let inCooldown = true;
    try {
      const cooldown = await this.runCooldown(context.author.id, context.t);
      if (cooldown === 'continue') inCooldown = false;
      if (cooldown === 'ratelimit') return;

      const subcommand = context.args[0] && this.getSubCommand(context.args[0].toLowerCase());
      if (subcommand) return await this.runSubCommand(subcommand, context);

      await this.runRequirements(context);
      await this.run(context);
    } catch (error) {
      this.client.emit('commandError', error, context);
    } finally {
      if (this.cooldown > 0 && !inCooldown) this.usersCooldown.add(context.author.id);
    }
  }

  runCooldown(userID, t) {
    const isCooldown = this.usersCooldown.isCooldown(userID);
    if (isCooldown === 'continue') return 'continue';
    else if (isCooldown === 'ratelimit') return 'ratelimit';
    else throw new CommandError(this.usersCooldown.toMessage(isCooldown, t));
  }


  async runRequirements(ctx) {
    const requirements = new Requirements(this.requirements, this.responses);
    await requirements.handle(ctx);
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
