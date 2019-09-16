'use strict';

const Requirements = require('./Requirements');
const RunStore = require('./stores/RunStore');

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
    this.running = new RunStore();
  }

  // eslint-disable-next-line no-empty-function
  async run() {}

  async _run(context) {
    try {
      const subcommand = context.args[0] && this.getSubCommand(context.args[0].toLowerCase());
      if (subcommand) return await this.runSubCommand(subcommand, context);

      await this.runRequirements(context)
      await this.run(context);
    } catch (error) {
      this.client.emit('commandError', error, context)
    }
  }

  async runRequirements (ctx) {
    const requirements = new Requirements(this.requirements, this.responses);
    return await requirements.handle(ctx)
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
