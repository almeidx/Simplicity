'use strict';

const { Command } = require('../../');

class Say extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['send'],
      category: 'util',
      requirements: {
        argsRequired: true,
      },
      responses: {
        argsRequired: 'commands:say.error',
      },
    });
  }

  async run({ channel, client, message, member, query, send }) {
    const checkPerms = (u, p) => channel.permissionsFor(u).has(p);
    if (checkPerms(client.user, 'MANAGE_MESSAGES') && checkPerms(member, 'ADMINISTRATOR')) await message.delete();

    return send(query);
  }
}

module.exports = Say;
