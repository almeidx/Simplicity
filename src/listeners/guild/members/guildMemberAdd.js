'use strict';

const { SimplicityListener, SimplicityEmbed, Utils: { getServerIconURL } } = require('../../../index');
const moment = require('moment');

class GuildMemberAdd extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, member) {
    const guild = member.guild;
    try {
      const guildData = client.database && await client.database.guilds.get(guild.id);
      const autorole = guildData && guild.roles.get(guildData.autorole);

      if (autorole) member.roles.add(autorole);
    } catch (error) {
      console.error(error);
    }

    const user = member.user;
    const date = moment(user.createdAt);

    this.sendLogMessage(guild.id, 'GuildMemberLog',
      new SimplicityEmbed(this.getFixedT(guild.id))
        .setTimestamp()
        .setColor(process.env.COLOR)
        .setAuthor(user.tag, user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setFooter('loggers:totalMembers', getServerIconURL(guild), { count: guild.memberCount })
        .addField('loggers:user', `${user} (${user.id})`)
        .addField('loggers:accountCreatedAt', `${date.format('LLL')} (${date.fromNow()})`)
        .addField('loggers:joinedAt', moment(member.joinedAt).format('LLL'))).catch(() => null);
  }
}

module.exports = GuildMemberAdd;
