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

  async run ({ author, send, t }, member, reason) {
    await member.ban(reason)
    const embed = new Embed({ t, author })
      .setTitle('commands:ban.success')
      .setDescription('commands:ban.userBanned', { user: member })
      .addField('commands:ban.bannedBy', `${author}`, true)
      .addField('commands:ban.reason', reason, true)
    send(embed)
  }
}

module.exports = Ban
