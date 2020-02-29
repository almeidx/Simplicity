'use strict';

const { Command } = require('@structures');

class Say extends Command {
  constructor(client) {
    super(client, {
      aliases: ['send'],
      category: 'util',
      name: 'say',
    }, [
      {
        missingError: 'commands:say.error',
        required: true,
        type: 'string',
      },
    ]);
  }

  async run({ channel, guild, message, member }, text) {
    if ([member, guild.me].every(m => channel.permissionsFor(m).has('MANAGE_MESSAGES'))) await message.delete();
    return channel.send(text);
  }
}

module.exports = Say;
