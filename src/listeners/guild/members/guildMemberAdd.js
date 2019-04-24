const moment = require('moment')
const { SimplicityListener, SimplicityEmbed } = require('../../../index')

class GuildMemberAdd extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (_, member) {
    const guild = member.guild
    const user = member.user

    this.sendLogMessage(guild.id, 'GuildMemberLog',
      new SimplicityEmbed(this.getFixedT(guild.id))
        .setTimestamp()
        .setColor(process.env.COLOR)
        .setAuthor(user.tag, user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setFooter('loggers:totalMembers', guild.iconURL(), { count: guild.memberCount })
        .addField('loggers:user', `${user} (${user.id})`)
        .addField('loggers:accountCreatedAt', `${moment(user.createdAt).format('LLLL')} (${moment(user.createdAt).fromNow()})`)
        .addField('loggers:joinedAt', moment().format('LLLL')))
  }
}

module.exports = GuildMemberAdd
