const { Command, SimplicityEmbed, Parameters: { MemberParameter, UserParameter }, CommandError } = require('../../')
const missingError = 'errors:invalidUser'
const optionsParameter = {
  required: false,
  canBeAuthor: false,
  checkGlobally: true,
  canBeGuildOwner: false,
  errors: {
    missingError
  }
}

class Ban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bean']
    this.category = 'mod'
    this.requirements = { permissions: ['BAN_MEMBERS'], clientPermissions: ['BAN_MEMBERS'], guildOnly: true }
  }

  async run ({ args, guild, client, member: memberAuthor, t, send, message }) {
    const user = await UserParameter.search(args[0], { client, guild }, optionsParameter)
    if (!user) throw new CommandError(missingError)

    const member = user && guild.member(user)

    if (member) {
      await MemberParameter.verifyExceptions(member, optionsParameter, { guild, memberAuthor, commandName: this.name })
    } else {
      const bans = await guild.fetchBans()
      const alreadyBanned = bans && bans.get(user.id)

      if (alreadyBanned) {
        const reason = alreadyBanned.reason ? 'commands:ban.alreadyBannedReason' : 'commands:ban.alreadyBannedNoReason'
        throw new CommandError(reason, { user, reason: alreadyBanned.reason })
      }
    }

    let days
    const reason = args.slice(1).join(' ').replace(/(--(d|days)\s[0-9]{1,})/i, (i) => {
      const number = Number(i.replace(/--(days|d)/i, ''))
      if (!isNaN(number)) days = number
      return ''
    }) || 'errors:noReason'

    const embed = new SimplicityEmbed({ t })
      .setDescription('utils:question', { confirm: 'yes', cancel: 'not' })
    const msg = await send(embed)
    const wordsContinue = ['y', 'yes', 'sim', 's', 'continue']
    const wordsCancel = ['n', 'não', 'not', 'cancel']
    const words = wordsContinue.concat(wordsCancel)
    const filter = (m) => m.author.id === memberAuthor.user.id && words.includes(m.content.toLowerCase())
    const collector = await message.channel.createMessageCollector(filter, { time: 15000, max: 1 })

    const deleteMessages = (m) => {
      if (message.channel.permissionsFor(guild.me).has('MANAGE_MESSAGES')) {
        if (m) m.delete()
        msg.delete()
      }
    }

    collector.once('collect', async (m) => {
      const word = m.content.toLowerCase()
      deleteMessages()
      if (wordsCancel.includes(word)) {
        embed.setDescription('commands:ban.banCanceled')
        await send(embed)
      } else {
        await guild.users.ban(user.id, { reason, days })
        return send(
          new SimplicityEmbed({ t })
            .setTitle('commands:ban.success')
            .setDescription('commands:ban.userBanned', { member })
            .addField('commands:ban.bannedBy', `${memberAuthor}`, true)
            .addField('commands:ban.reason', reason, true)
            .setFooter(!days ? '' : 'commands:ban.days', null, { days })
        )
      }
    })

    collector.once('end', () => {
      deleteMessages()
      embed.setDescription('utils:commandTimedout')
      send(embed)
    })
  }
}

module.exports = Ban
