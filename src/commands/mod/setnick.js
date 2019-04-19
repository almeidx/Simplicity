const { Command, CommandError, Parameters, SimplicityEmbed } = require('../../')
const { MemberParameter, StringParameter, UserParameter } = Parameters

const MemberParameterOptions = {
  required: false,
  canBeAuthor: false,
  canBeGuildOwner: false,
  errors: {
    missingError: 'errors:invalidUser'
  }
}
const StringParameterOptions = {
  maxLength: 32,
  errors: {
    maxLength: 'commands:nick:nameTooBig',
  }
}

class SetNick extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['nick', 'nickname', 'setnickname']
    this.category = 'mod'
    this.requirements = {
      permissions: ['MANAGE_NICKNAMES'],
      clientPermissions: ['MANAGE_NICKNAMES'],
      guildOnly: true,
      argsRequired: true }
  }

  async run ({ args, author, channel, guild, member: memberAuthor, message, send, t }) {
    const user = args.shift()
    let m = await UserParameter.search(user, { guild })

    let member = guild.member(m)
    if (!member) member = memberAuthor
    await MemberParameter.verifyExceptions(member, MemberParameterOptions, { guild, memberAuthor, commandName: this.name })

    const name = await StringParameter.parse(args[0], StringParameterOptions)
    const reason = t('commands:setnick.reason', { author: author.tag })

    const nickname = member.setNickname(name, { reason }).catch(() => null)
    if (!nickname) throw new CommandError('commands:setnick.failed')
    else {
      const embed = new SimplicityEmbed({ author, t })
        .setDescription('commands:setnick.success', { user: member.user, name })
      return send(embed)
    }
  }
}

module.exports = SetNick
