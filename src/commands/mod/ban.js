const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Ban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bean']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['BAN_MEMBERS'], clientPermissions: ['BAN_MEMBERS'] }
  }
  run ({ author, guild, send, message, member, t, args }) {
    let reason = args.slice(1).join(' ')
    let mem = this.getUser(message, args)
    let msg, title
    const embed = new MessageEmbed()
      .setAuthor(author.username, author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')
      .setTitle(t('errors:denied'))
    if (!mem) {
      msg = t('commands:ban.usage')
      title = t('commands:ban.invalidUser')
    } else if (member.roles.highest.position <= mem.roles.highest.position) {
      msg = t('errors:userMissingRole', { action: t('commands:ban.action') })
    } else if (guild.me.roles.highest.position <= mem.roles.highest.position) {
      msg = t('errors:clientMissingRole', { action: t('commands:ban.action') })
    } else {
      mem.ban({ days: 7, reason: author.tag + ' | ' + (reason || t('commands:ban.noReason')) })
      title = t('commands:ban.success')
      msg = t('commands:ban.userBanned', { user: mem })
      embed.addField(t('commands:ban.bannedBy'), author, true)
        .addField(t('commands:ban.reason'), reason || t('commands:ban.noReason'))
        .setThumbnail(author.displayAvatarURL({ size: 2048 }))
    }
    if (msg) embed.setDescription(msg)
    if (title) embed.setTitle(title)
    send(embed)
  }
  getUser (message, [query = null]) {
    let mem = message.mentions.members.first()
    let checkMention = new RegExp('(^<@[0-9]*>)', 'g').test(query)
    if (mem && checkMention) {
      return mem
    }
    mem = message.guild.member(query)
    if (mem) {
      return mem
    }
  }
}
module.exports = Ban
