'use strict';

const { Command } = require('@structures');

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
    }, [
      {
        type: 'number',
        required: true,
        min: 2,
        max: 100,
      },
      ...new Array(10).fill({
        type: 'user',
        required: false,
        fetchGlobal: false,
        acceptSelf: true,
        acceptBot: true,
      }),
      [
        {
          name: 'bot',
          aliases: ['b'],
          type: 'booleanFlag',
        },
        {
          name: 'role',
          aliases: ['r'],
          type: 'role',
        },
        {
          name: 'uppercase',
          aliases: ['upper', 'highcase'],
          type: 'booleanFlag',
        },
      ],
    ]);
  }

  async run({ author, channel, client, flags, message, send, t }, limit, ...users) {
    message.delete();
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
      await channel.bulkDelete(filtered);
      const msg = await send(t('commands:clear.deleted', { amount: filtered.length, author: author.tag }));
      msg.delete({ timeout: 5000 });
    } catch (error) {
      client.logger.error(error);
    }
  }
}

module.exports = Clear;
