const { Command, Embed } = require('../../')

class Ban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bean']
    this.category = 'mod'
    this.parameters = [{
      type: 'member',
      required: true,
      argFirst: true,
      onlyRoleHighest: true,
      onlyBotRoleHighest: true,
      missingError: 'errors:invalidUser'
    }, {
      type: 'string',
      default: 'noReason'
    }]
    this.requirements = { permissions: ['BAN_MEMBERS'], clientPermissions: ['BAN_MEMBERS'] }
  }

  async run ({ author, guild, send, t }, member, reason) {
    const embed = new Embed({ t, author })
    const bans = await guild.fetchBans()

    if (bans && bans.has(user.id)) {
      const reason = bans[user.id].reason // nem tenho certeza se é assim kk to com preguiça
      embed
        .setTitle('errors:oops')
        .setDescription('commands:ban.alreadyBanned', { user, reason }) // coloca nos commands.json: "It seems that {{- user }} is already banned from this guild for {{- reason }}!"
    }

    await member.ban(reason)

    embed
      .setTitle('commands:ban.success')
      .setDescription('commands:ban.userBanned', { user: member })
      .addField('commands:ban.bannedBy', `${author}`, true)
      .addField('commands:ban.reason', reason, true)
    send(embed)
  }
}

module.exports = Ban
