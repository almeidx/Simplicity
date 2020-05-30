'use strict';

const { SimplicityListener } = require('@structures');

class GuildMemberAddListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, member) {
    const { guild } = member;
    const { autorole } = await client.database.guilds.get(guild.id);

    if (autorole) {
      const role = guild.roles.cache.get(autorole);
      if (role) await member.roles.add(role, 'Auto role');
    }
  }
}

module.exports = GuildMemberAddListener;
