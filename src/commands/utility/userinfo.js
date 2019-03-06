const { Command, Embed } = require('../../')
const moment = require('moment')

class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ui', 'user']
    this.category = 'util'
    this.parameters = [{
      type: 'user',
      required: false,
      checkUserGlobal: true
    }]
    this.requirements = { permissions: ['EMBED_LINKS'] }
  }

  run ({ author, guild, send, t, emoji }, user) {
    if (!user) user = author

    const status = user.presence.status
    const created = moment(user.createdAt)
    const joined = guild.member(user) && moment(guild.member(user).joinedAt)

    const embed = new Embed({ author, t, emoji, autoAuthor: false })
      .setAuthor(user.tag, user.displayAvatarURL())
      .setThumbnail(user.displayAvatarURL())
      .addField('commands:userinfo.name', user.tag, true)
      .addField('commands:userinfo.id', user.id, true)
      .addField('commands:userinfo.status', `utils:status.${status}`, false, {}, { emoji: status })
      .addField('commands:userinfo.createdAt', `${created.format('LL')} (${created.fromNow()})`)

    if (guild.member(user)) embed.addField('commands:userinfo.joinedAt', `${joined.format('LL')} (${joined.fromNow()})`)

    send(embed)
  }
}
module.exports = UserInfo
