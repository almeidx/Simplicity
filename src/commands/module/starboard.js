'use strict';

const { Command } = require('@structures');

class Starboard extends Command {
  constructor(client) {
    super(client, 'starboard', {
      args: [
        {
          required: false,
          type: 'channel',
        },
      ],
      category: 'module',
      cooldown: 5000,
      requirements: {
        guildOnly: true,
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
    });
  }

  async run({ guild, channel: currentChannel, guildData, database, t, send }, channel = currentChannel) {
    const channelId = channel.id === guildData.starboard ? null : channel.id;
    await database.guilds.edit(guild.id, { starboard: channelId });

    let message = t('commands:starboard.enabled', { channel: `${channel}` });

    if (channelId && guildData.starboard && guildData.starboard !== channelId) {
      message = t('commands:starboard.channelChanged', { channel: `${channel}` });
    } else if (!channelId) {
      message = t('commands:starboard.disabled', { channel: `${channel}` });
    }

    await send(message);
  }
}

module.exports = Starboard;
