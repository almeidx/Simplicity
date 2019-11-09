'use strict';

const { Command } = require('@structures');
const { ChannelParameter } = require('@parameters');

class Starboard extends Command {
  constructor(client) {
    super(client, {
      name: 'starboard',
      category: 'guild',
      cooldown: 30000,
      requirements: {
        requireDatabase: true,
        permissions: ['MANAGE_GUILD'],
        guildOnly: true,
      },
    });
  }

  async run({ query, guild, channel: currentChannel, guildData, database, t, send }) {
    const channel = !query ? currentChannel : await ChannelParameter.parse(query, { required: true }, { guild });
    const channelId = channel.id === guildData.starboard ? null : channel.id;
    await database.guilds.edit(guild.id, { starboard: channelId });

    let message = t('commands:starboard.enabled', { channel: channel.toString() });

    if (channelId && guildData.starboard && guildData.starboard !== channelId) {
      message = t('commands:starboard.channelChanged', { channel: channel.toString() });
    } else if (!channelId) {
      message = t('commands:starboard.disabled', { channel: channel.toString() });
    }

    await send(message);
  }
}

module.exports = Starboard;
