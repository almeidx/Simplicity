'use strict';

const { SimplicityEmbed, SimplicityListener } = require('@structures');
const { getServerIconURL } = require('@util/Util');

class GuildCreateListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, guild) {
    if (client.database) await client.database.guilds.create(guild.id);
    const owner = guild.owner;

    this.sendMessage('guild_join',
      new SimplicityEmbed({ author: owner.user })
        .addField('Guild Name', guild.name, true)
        .addField('Guild ID', guild.id, true)
        .addField('Members | Channels | Emojis', `${guild.memberCount} | ${guild.channels.cache.size} | ${guild.emojis.cache.size}`)
        .setThumbnail(getServerIconURL(guild)));
  }
}

module.exports = GuildCreateListener;
