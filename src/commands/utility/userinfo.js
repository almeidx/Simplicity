const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')
const moment = require('moment')

class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ui', 'user']
    this.category = 'util'
  }
  run ({ guild, send, message, member, query, args, t, emoji }) {
    const embed = new MessageEmbed()
    let mem = message.mentions.members.last() || this.client.users.get(query, true) || guild.members.find(m => m.displayName.toLowerCase().startsWith(query.toLowerCase()) || m.user.username.toLowerCase().startsWith(query.toLowerCase()) || m.displayName.toLowerCase().endsWith(query.toLowerCase()) || m.user.username.toLowerCase().endsWith(query.toLowerCase())) || member
    if (args.length === 0) mem = member
    embed.setAuthor((mem.user || mem).username, (mem.user || mem).displayAvatarURL({ size: 2048 }))
      .addField('commands:userinfo.name', (mem.user || mem).tag, true)
      .addField('commands:userinfo.id', mem.id, true)
      .addField('commands:userinfo.status', `${emoji((mem.user || mem).presence.status.toUpperCase())} ${t('utils:status.' + (mem.user || mem).presence.status)}`)
      .addField('commands:userinfo.createdAt', `${moment((mem.user || mem).createdAt).format('LL')} (${moment((mem.user || mem).createdAt).fromNow()})`)
      .setThumbnail((mem.user || mem).displayAvatarURL({ size: 2048 }))
    if (mem.guild) {
      embed.addField('commands:userinfo.joinedAt', `${moment(mem.joinedAt).format('LL')} (${moment(mem.joinedAt).fromNow()})`)
    }
    send(embed, { autoAuthor: false })
  }
}
module.exports = UserInfo
