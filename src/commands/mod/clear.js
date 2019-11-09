'use strict';

const { Command, CommandError, SimplicityEmbed } = require('@structures');

class Clear extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      aliases: ['purge', 'prune', 'clean'],
      category: 'mod',
      requirements: {
        argsRequired: true,
        permissions: ['MANAGE_MESSAGES'],
        clientPermissions: ['MANAGE_MESSAGES'],
      },
    });
  }

  async run({ author, channel, message, send, t, query }) {
    const embed = new SimplicityEmbed({ author, t });
    const limit = Number(query);

    if (!limit || limit < 2 || limit > 100) throw new CommandError('commands:clear.invalidValue');

    await message.delete().catch(() => null);

    const res = await channel.messages.fetch({ limit });
    await channel.bulkDelete(res);

    const amount = res.size;
    embed.setDescription('commands:clear.deleted', { amount, author });

    const msg = await send(embed);
    msg.delete({ timeout: 5000 });
  }
}

module.exports = Clear;
