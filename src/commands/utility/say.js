'use strict';

const { Command } = require('@structures');
const { Util } = require('discord.js');

class Say extends Command {
  constructor(client) {
    super(client, 'say', {
      aliases: ['send'],
      args: [
        {
          missingError: 'commands:say.error',
          required: true,
          type: 'string',
        },
      ],
      category: 'util',
    });
  }

  async run({ channel, guild, message, member }, text) {
    const options = {};
    if ([member, guild.me].every((m) => channel.permissionsFor(m).has('MANAGE_MESSAGES'))) await message.delete();
    if (!member.permissions.has('MENTION_EVERYONE')) {
      text = Util.cleanContent(text, message);
      options.disableMentions = 'all';
    }

    return channel.send(text, options);
  }
}

module.exports = Say;
