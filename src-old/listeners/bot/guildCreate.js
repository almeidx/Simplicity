'use strict';

const { SimplicityEmbed, SimplicityListener, Utils: { getServerIconURL } } = require('../../');

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
        .addField('Members | Channels | Emojis', `${guild.memberCount} | ${guild.channels.size} | ${guild.emojis.size}`)
        .setThumbnail(getServerIconURL(guild)));
  }
}

module.exports = GuildCreateListener;
