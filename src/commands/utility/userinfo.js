const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')
const moment = require('moment')

class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ui', 'user']
    this.category = 'util'
  }
  run ({ author, guild, send, message, member, args, t, emoji }) {
    const embed = new MessageEmbed()
    if (args.length === 0) {
      embed.addField('commands:userinfo.name', author.tag, true)
        .addField('commands:userinfo.id', member.id)
        .addField('commands:userinfo.status', `${emoji(author.presence.status.toUpperCase())} ${t('utils:status.' + author.presence.status)}`)
        .addField('commands:userinfo.createdAt', `${moment(author.createdAt).format('LL')} (\`${moment(author.createdAt).fromNow()}\`)`)
        .addField('commands:userinfo.joinedAt', `${moment(member.joinedAt).format('LL')} (\`${moment(member.joinedAt).fromNow()}\`)`)
        .setAuthor(author.tag, author.displayAvatarURL({ size: 2048 }))
        .setThumbnail(author.displayAvatarURL({ size: 2048 }))
      return send(embed)
    } else if (message.mentions.members.first()) {
      const mem = message.mentions.members.first()
      embed.addField(t('commands:userinfo.name'), mem.user.tag, true)
	    .addField(t('commands:userinfo.id'), mem.id)
        .addField(t('commands:userinfo.status'), `${emoji(mem.presence.status.toUpperCase())} ${t('utils:status.' + mem.presence.status)}`, true)
        .addField(t('commands:userinfo.createdAt'), `${moment(mem.user.createdAt).format('LL')} (\`${moment(mem.user.createdAt).fromNow()}\`)`, true)
        .addField(t('commands:userinfo.joinedAt'), `${moment(guild.members.get(mem.id).joinedAt).format('LL')} (\`${moment(guild.members.get(mem.id).joinedAt).fromNow()}\`)`, true)
        .setAuthor(mem.user.tag, mem.user.displayAvatarURL({ size: 2048 }))
        .setThumbnail(mem.user.displayAvatarURL({ size: 2048 }))
      return send(embed)
    } else {
      this.client.users.fetch(args)
        .then(u => {
          embed.addField(t('commands:userinfo.name'), u.tag, true)
		    .addField(t('commands:userinfo.id'), u.id, true)
            .addField(t('commands:userinfo.status'), `${emoji(u.presence.status.toUpperCase())} ${t('utils:status.' + u.presence.status)}`)
            .addField(t('commands:userinfo.createdAt'), `${moment(u.createdAt).format('LL')} (\`${moment(u.createdAt).fromNow()}\`)`)
            .setThumbnail(u.displayAvatarURL({ size: 2048 }))
            .setAuthor(u.tag, u.displayAvatarURL({ size: 2048 }))
          if (guild.members.get(u.id)) {
            embed.addField(t('commands:userinfo.joinedAt'), `${moment(guild.members.get(u.id).joinedAt).format('LL')} (\`${moment(guild.members.get(u.id).joinedAt).fromNow()}\`)`)
          }
          return send(embed)
        })
        .catch(() => {
          embed.setTitle(t('errors:oops'))
            .setDescription(t('errors:general'))
          return send(embed, { error: true })
        })
    }
  }
}
module.exports = UserInfo
