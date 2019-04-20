const { Command, CommandError, Parameters, SimplicityEmbed } = require('../../')
const { MemberParameter, StringParameter, UserParameter } = Parameters

const MemberParameterOptions = {
  required: false,
  canBeGuildOwner: false,
  canBeAuthor: true,
  errors: {
    missingError: 'errors:invalidUser'
  }
}
const StringParameterOptions = {
  maxLength: 32,
  errors: {
    maxLength: 'commands:setnick.nameTooBig',
  }
}

class SetNick extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['nick', 'nickname', 'setnickname']
    this.category = 'mod'
    this.WIP = true
    this.requirements = {
      permissions: ['MANAGE_NICKNAMES'],
      clientPermissions: ['MANAGE_NICKNAMES'],
      guildOnly: true,
      argsRequired: true }
  }

  async run ({ args, author, channel, client, guild, member, message, send, t }) {
    const u = await UserParameter.search(args.shift(), {
      checkIncludes: false
    }, { author, client, guild })

    const mem = guild.member(u) || member
    await MemberParameter.verifyExceptions(mem, MemberParameterOptions, { author, guild, memberAuthor: member, commandName: this.name })

    let name = await StringParameter.parse(args[0], StringParameterOptions)
    let renamedTo
    if (!name) {
      name = ''
      renamedTo = t('commands:setnick.removedNickname', { user: mem })
    } else renamedTo = t('commands:setnick.success', { user: mem, name})

    const reason = t('commands:setnick.reason', { author: author.tag })
    if (mem.displayName === name) throw new CommandError('commands:setnick.alreadySet', { user: mem, name })
    else if (!mem.nickname && !name) throw new CommandError('commands:setnick.alreadyReset', { user: mem })

    const nickname = member.setNickname(name, reason).catch(() => null)
    if (!nickname) throw new CommandError('commands:setnick.failed')
    else {
      const embed = new SimplicityEmbed({ author })
        .setDescription(renamedTo)
      return send(embed)
    }
  }
}

module.exports = SetNick
