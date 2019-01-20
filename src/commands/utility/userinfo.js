const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')
const moment = require('moment')

class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ui', 'user']
    this.category = 'util'
  }
  run ({ author, send, message, args, t }) {
    const embed = new MessageEmbed()
      .setFooter(`${t('utils:footer')} ${author.tag}`, author.displayAvatarURL({ size: 2048 }))
    if (args.length === 0) {
      embed.addField(t('commands:userinfo.name'), author.tag, true)
        .addField(t('commands:userinfo.id'), author.id, true)
        .addField(t('commands:userinfo.createdAt'), `${moment(author.createdAt).format('LL')} (\`${moment(author.createdAt).fromNow()}\`)`)
        .addField(t('commands:userinfo.joinedAt'), `${moment(author.joinedAt).format('LL')} (\`${moment(author.joinedAt).fromNow()}\`)`)
        .setAuthor(author.tag, author.displayAvatarURL({ size: 2048 }))
        .setThumbnail(author.displayAvatarURL({ size: 2048 }))
      return send(embed)
    } else if (message.mentions.members.first()) {
      const mem = message.mentions.members.first()
      embed.addField(t('commands:userinfo.name'), mem.user.tag, true)
        .addField(t('commands:userinfo.id'), mem.id, true)
        .addField(t('commands:userinfo.createdAt'), `${moment(mem.user.createdAt).format('LL')} (\`${moment(mem.user.createdAt).fromNow()}\`)`)
        .setAuthor(mem.user.tag, mem.user.displayAvatarURL({ size: 2048 }))
        .setThumbnail(mem.user.displayAvatarURL({ size: 2048 }))
      return send(embed)
    } else {
      this.client.users.fetch(args)
        .then(u => {
          embed.addField(t('commands:userinfo.name'), u.tag, true)
            .addField(t('commands:userinfo.id'), u.id, true)
            .addField(t('commands:userinfo.createdAt'), `${moment(u.createdAt).format('LL')} (\`${moment(u.createdAt).fromNow()}\`)`)
            .setAuthor(u.tag, u.displayAvatarURL({ size: 2048 }))
            .setThumbnail(u.displayAvatarURL({ size: 2048 }))
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
