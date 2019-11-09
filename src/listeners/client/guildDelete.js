'use strict';

const { SimplicityEmbed, SimplicityListener } = require('@structures');
const { getServerIconURL } = require('@utils/Utils');

class GuildDeleteListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, guild) {
    if (client.database) await client.database.guilds.remove(guild.id);
    const owner = guild.owner;

    this.sendMessage('guild_leave',
      new SimplicityEmbed({ author: owner.user })
        .addField('Guild Name', guild.name, true)
        .addField('Guild ID', guild.id, true)
        .addField('Members | Channels | Emojis', `${guild.memberCount} | ${guild.channels.size} | ${guild.emojis.size}`)
        .setThumbnail(getServerIconURL(guild)));
  }
}

module.exports = GuildDeleteListener;
