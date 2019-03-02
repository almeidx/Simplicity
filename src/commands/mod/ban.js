const { Command, Embed } = require('../../')

class Ban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bean']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['BAN_MEMBERS'], clientPermissions: ['BAN_MEMBERS'] }
  }
  run ({ author, guild, send, message, member, t, args }) {
    const reason = args.slice(1).join(' ')
    const mem = this.getUser(message, args)
    let msg, title

    const embed = new Embed({ t, author, member, guild })
      .setColor('RED')
      .setTitle('errors:denied')

    if (!mem) {
      msg = 'commands:ban.usage'
      title = 'commands:ban.invalidUser'
    } else if (member.roles.highest.position <= mem.roles.highest.position) {
      msg = t('errors:userMissingRole', { action: 'commands:ban.action' })
    } else if (guild.me.roles.highest.position <= mem.roles.highest.position) {
      msg = t('errors:clientMissingRole', { action: t('commands:ban.action') })
    } else {
      mem.ban({ days: 7, reason: `${author.tag} | ${reason || 'commands:ban.noReason'}` })
      title = 'commands:ban.success'
      msg = t('commands:ban.userBanned', { user: mem })
      embed.addField(t('commands:ban.bannedBy'), author, true)
        .addField(t('commands:ban.reason'), reason || t('commands:ban.noReason'))
    }
    if (msg) embed.setDescription(msg)
    if (title) embed.setTitle(title)
    send(embed)
  }
  getUser (message, [query = null]) {
    const checkMention = new RegExp('(^<@[0-9]*>)', 'g').test(query)
    let mem = message.mentions.members.first()
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
