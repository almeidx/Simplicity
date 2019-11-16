'use strict';

const { Command } = require('@structures');

class Say extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['send'],
      category: 'util',
    }, [
      {
        type: 'string',
        required: true,
        missingError: 'commands:say.error',
      },
    ]);
  }

  async run({ channel, guild, message, member }, text) {
    if (channel.permissionsFor(member).has('MANAGE_MESSAGES') &&
    channel.permissionsFor(guild.me).has('MANAGE_MESSAGES')
    ) await message.delete();

    return channel.send(text);
  }
}

module.exports = Say;
