const { Command, Embed, Parameters: { MemberParameter }, CommandError } = require('../../')
const Collector = require('../../utils/Collector')

const missingError = 'errors:invalidUser'
const Member = new MemberParameter({
  acceptSelf: false,
  required: false,
  argFirst: true,
  onlyRoleHighest: true,
  onlyBotRoleHighest: true,
  missingError
})

class Ban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bean']
    this.category = 'mod'
    this.requirements = { permissions: ['BAN_MEMBERS'], clientPermissions: ['BAN_MEMBERS'] }
  }

  async run (context) {
    const { guild, send, author, t, args, emoji, message } = context
    const query = args[0] || ''
    let member = await Member.handle(context, query)
    let id = member && member.id

    if (!member) {
      const user = await this.client.users.fetch(query).catch(() => { throw new CommandError(missingError) })
      const bans = await guild.fetchBans()
      const alreadyBanned = bans && bans.get(user.id)

      if (alreadyBanned) {
        const message = alreadyBanned.reason ? 'commands:ban.alreadyBannedReason' : 'commands:ban.alreadyBannedNoReason'
        throw new CommandError(message, { user, reason: (alreadyBanned.reason || '') })
      }
      id = user.id
      member = user
    }

    let days = 0
    const reason = args.slice(1).join(' ').replace(/(--(d|days)\s[0-9]{1,})/i, (i) => {
      const number = Number(i.replace(/--(days|d)/i, ''))
      if (!isNaN(number)) days = number
      return ''
    }) || t('errors:noReason')

    const { type, collector } = Collector.handle(message, {
      reactions: [emoji('SUCCESS', { id: true }), emoji('CANCEL', { id: true })],
      text: `Para continua reaja com ${emoji('SUCCESS')} e para cancelar ${emoji('CANCEL')}`,
      options: { max: 1 }
    }, {

    })

    // await guild.users.ban(id, { reason, days })
    return send(
      new Embed({ t })
        .setTitle('commands:ban.success')
        .setDescription('commands:ban.userBanned', { user: member })
        .addField('commands:ban.bannedBy', `${author}`, true)
        .addField('commands:ban.reason', reason, true)
        .setFooter('ba e' + days)
    )
  }
}

module.exports = Ban
