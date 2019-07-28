'use strict';

const { SimplicityEmbed, SimplicityListener } = require('../../');

class GuildDelete extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, guild) {
    await client.database.guilds.remove(guild.id);
    const owner = guild.owner;

    this.sendMessage('guild_leave',
      new SimplicityEmbed()
        .setAuthor(owner.user.tag, owner.user.displayAvatarURL())
        .addField('Guild Name', guild.name, true)
        .addField('Guild ID', guild.id, true)
        .addField('Members | Channels | Emojis', `${guild.memberCount} | ${guild.channels.size} | ${guild.emojis.size}`)
        .setFooter(`Owner ID: ${owner.id}`)
        .setThumbnail(guild.iconURl())
        .setTimestamp()
    );
  }
}

module.exports = GuildDelete;
