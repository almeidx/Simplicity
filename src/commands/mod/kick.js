const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Kick extends Command {
  constructor (client) {
    super(client)
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['KICK_MEMBERS'], clientPermissions: ['KICK_MEMBERS'] }
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
      msg = t('commands:kick.usage')
      title = t('commands:kick.invalidUser')
    } else if (member.roles.highest.position <= mem.roles.highest.position) {
      msg = t('errors:userMissingRole', { action: t('commands:kick.action') })
    } else if (guild.me.roles.highest.position <= mem.roles.highest.position) {
      msg = t('errors:clientMissingRole', { action: t('commands:kick.action') })
    } else {
      mem.kick({ reason: author.tag + ' | ' + (reason || t('commands:ban.noReason')) })
      title = t('commands:kick.success')
      msg = t('commands:kick.userKicked', { user: mem })
      embed.addField(t('commands:kick.kickedBy'), author, true)
        .addField(t('commands:kick.reason'), reason || t('commands:kick.noReason'))
        .setThumbnail(author.displayAvatarURL({ size: 2048 }))
    }
    if (msg) embed.setDescription(msg)
    if (title) embed.setTitle(title)
    send(embed)
  }
  getUser (message, [query = null]) {
    let member = message.mentions.members.first()
    let checkMention = new RegExp('(^<@[0-9]*>)', 'g').test(query)
    if (member && checkMention) {
      return member
    }
    member = message.guild.member(query)
    if (member) {
      return member
    }
  }
}
module.exports = Kick
