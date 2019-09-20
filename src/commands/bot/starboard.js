'use strict';

const { Command } = require('../..');

class Starboard extends Command {
  constructor(client) {
    super(client, {
      name: 'starboard',
      aliases: ['testestarboard'],
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

    let message;
    if (id) message = t('commands:starboard.enabled', { channel: channel.toString() });
    else message = t('commands:starboard.disabled', { channel: channel.toString() });
    await send(message);
  }
}

module.exports = Starboard;
