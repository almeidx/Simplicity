'use strict';

const { Command, CommandError, SimplicityEmbed } = require('../../');

class Clear extends Command {
  constructor(client) {
    super(client);
    this.aliases = ['purge', 'prune', 'clean'];
    this.category = 'mod';
    this.requirements = {
      argsRequired: true,
      permissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'] };
  }

  async run({ author, channel, message, send, t, query }) {
    const embed = new SimplicityEmbed({ author, t });
    const limit = Number(query);

    if (!limit || limit < 2 || limit > 100) throw new CommandError('commands:clear.invalidValue');

    await message.delete().catch(() => null);

    const res = await channel.messages.fetch({ limit });
    const deleted = await channel.bulkDelete(res).catch(console.error);
    if (!deleted) throw new CommandError('commands:clear.error');

    const amount = res.size;
    embed.setDescription('commands:clear.deleted', { amount, author });

    const msg = await send(embed);
    msg.delete({ timeout: 5000 });
  }
}

module.exports = Clear;
