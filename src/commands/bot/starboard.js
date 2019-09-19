'use strict';

const { Command } = require('../..');

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: 'starboard',
      category: 'bot',
      cooldown: 60000,
      requirements: {
        requireDatabase: true,
        permissions: ['MANAGE_GUILD'] },
    });
  }

  async run({ mentions, channel: _channel, guildData, database, guild, t, send }) {
    const channel = mentions.channels.first() || _channel;
    const id = guildData.starboard === channel.id ? null : channel.id;
    await database.guilds.edit(guild.id, { starboard: id });

    const message = t('commands:starboard.message', { enabled: !!id, channel: channel.toString() });
    await send(message);
  }
}

module.exports = Prefix;
