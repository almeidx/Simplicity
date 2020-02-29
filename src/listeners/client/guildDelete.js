'use strict';

const { SimplicityEmbed, SimplicityListener } = require('@structures');
const { getServerIconURL } = require('@util/Util');

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
        .addField('Member Count', guild.memberCount)
        .setThumbnail(getServerIconURL(guild)));
  }
}

module.exports = GuildDeleteListener;
