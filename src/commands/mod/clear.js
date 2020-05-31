'use strict';

const { Command } = require('@structures');

class Clear extends Command {
  constructor(client) {
    super(client, 'clear', {
      aliases: ['purge', 'prune', 'clean'],
      args: [
        {
          max: 100,
          min: 2,
          missingError: 'commands:clear.invalidValue',
          required: true,
          type: 'number',
        },
        ...new Array(10).fill({
          acceptBot: true,
          acceptSelf: true,
          fetchGlobal: false,
          required: false,
          type: 'user',
        }),
      ],
      category: 'mod',
      flags: [
        {
          aliases: ['b'],
          name: 'bot',
          type: 'booleanFlag',
        },
        {
          aliases: ['r'],
          name: 'role',
          type: 'role',
        },
        {
          aliases: ['upper', 'highcase'],
          name: 'uppercase',
          type: 'booleanFlag',
        },
      ],
      requirements: {
        clientPermissions: ['MANAGE_MESSAGES'],
        permissions: ['MANAGE_MESSAGES'],
      },
    });
  }

  async run({ author, channel, client, flags, message, send, t }, limit, ...users) {
    await message.delete();
    const { uppercase, bot, role } = flags;
    const res = await channel.messages.fetch({ limit });

    const filtered = res.array().filter((msg) => {
      const members = users.filter((u) => u);
      if (members.length && members.every((user) => msg.author.id !== user.id)) return false;
      else if (uppercase && msg.content.toUpperCase() !== msg.content) return false;
      else if (bot && !msg.author.bot) return false;
      else if (role && !msg.member.roles.has(role.id)) return false;
      else return true;
    });

    try {
      await channel.bulkDelete(filtered, true);
      const msg = await send(t('commands:clear.deleted', { amount: filtered.length, author: author.tag }));
      msg.delete({ timeout: 5000 });
    } catch (error) {
      client.logger.error(error);
    }
  }
}

module.exports = Clear;
