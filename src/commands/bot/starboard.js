'use strict';

const { Command, Parameters: { ChannelParameter } } = require('../..');

class Starboard extends Command {
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

  async run({ query, guild, channel: _channel, guildData, database, t, send }) {
    const channel = await ChannelParameter.parse(query, {}, { guild }) || _channel;
    const channelId = channel.id === guildData.starboard ? null : channel.id;
    await database.guilds.edit(guild.id, { starboard: channelId });

    let message = t('commands:starboard.enabled', { channel: channel.toString() });

    if (guildData.starboard && guildData.starboard !== channelId) {
      message = t('commands:starboard.channelChanged', { channel: channel.toString() });
    } else if (!channelId) {
      message = t('commands:starboard.disabled', { channel: channel.toString() });
    }

    await send(message);
  }
}

module.exports = Starboard;
