'use strict';

const Parameters = require('@parameters');
const { Command } = require('@structures');

class Starboard extends Command {
  constructor(client) {
    super(client, {
      category: 'module',
      cooldown: 5000,
      name: 'starboard',
      requirements: {
        guildOnly: true,
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
    });
  }

  async run({ query, guild, channel: currentChannel, guildData, database, t, send, client, member }) {
    const channel = !query ? currentChannel : await Parameters.channel.parse.call(
      { acceptText: true, required: true },
      query,
      { client, guild, member, t },
    );
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
