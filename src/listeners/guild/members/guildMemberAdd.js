const moment = require('moment')
const { SimplicityListener, SimplicityEmbed, Utils } = require('../../../index')

class GuildMemberAdd extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (_, member) {
    const guild = member.guild
    const user = member.user
    const date = moment(user.createdAt)

    this.sendLogMessage(guild.id, 'GuildMemberLog',
      new SimplicityEmbed(this.getFixedT(guild.id))
        .setTimestamp()
        .setColor(process.env.COLOR)
        .setAuthor(user.tag, user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setFooter('loggers:totalMembers', Utils.getServerIconURL(guild), { count: guild.memberCount })
        .addField('loggers:user', `${user} (${user.id})`)
        .addField('loggers:accountCreatedAt', `${date.format('LLL')} (${date.fromNow()})`)
        .addField('loggers:joinedAt', moment(member.joinedAt).format('LLL'))).catch(() => null)
  }
}

module.exports = GuildMemberAdd
