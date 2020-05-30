'use strict';

const { SimplicityEmbed, SimplicityListener } = require('@structures');
const { getServerIconURL } = require('@util/Util');

class GuildCreateListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, guild) {
    // GET Function create when not found
    const owner = guild.owner;

    this.sendMessage('guild_join',
      new SimplicityEmbed({ author: owner.user })
        .addField('Guild Name', guild.name, true)
        .addField('Guild ID', guild.id, true)
        .addField('Member Count', guild.memberCount)
        .setThumbnail(getServerIconURL(guild)));

    if (client.database) {
      await client.database.guilds.get(guild.id);
      await client.database.joinLeaveGuild.model.create({
        date_at: new Date(),
        guild_id: guild.id,
        type: 'JOIN',
      });
    }
  }
}

module.exports = GuildCreateListener;
