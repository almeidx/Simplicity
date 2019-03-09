const { Command, Embed } = require('../../')

class Ban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bean']
    this.category = 'mod'
    this.parameters = [{
      type: 'user',
      required: true
    }]
    this.requirements = { argsRequired: true, permissions: ['BAN_MEMBERS'], clientPermissions: ['BAN_MEMBERS'] }
  }
  run ({ author, guild, send, member, t, args }, user) {
    const reason = args.slice(1).join(' ') || 'commands:ban.noReason'

    const embed = new Embed({ t, author, member, guild })
      .setTimestamp()
      .setTitle('errors:invalidParameters')

    // AUTHOR ROLES ARE LOWER OR THE SAME AS THE USER
    if (member.roles.highest.position <= user.roles.highest.position) {
      embed.setError()
        .setDescription('errors:userMissingRole', { action: 'commands:ban.action' })
      return send(embed)
    } else

    // BOT ROLES ARE LOWER OR THE SAME AS THE USER
    if (guild.me.roles.highest.position <= user.roles.highest.position) {
      embed.setError()
        .setDescription('errors:clientMissingRole', { action: t('commands:ban.action') })
      return send(embed)
    } else {
      user.ban({ days: 7, reason: `${author.tag} | ${reason}` })

      embed.setTitle('commands:ban.success')
        .setDescription('commands:ban.userBanned', { user })
        .addField('commands:ban.bannedBy', author, true)
        .addField('commands:ban.reason', reason, true)

      return send(embed)
    }
  }
}

module.exports = Ban
