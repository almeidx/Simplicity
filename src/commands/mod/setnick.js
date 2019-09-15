const { Command, CommandError, Parameters, SimplicityEmbed } = require('../../')
const { MemberParameter, StringParameter } = Parameters

const MemberParameterOptions = {
  checkIncludes: false,
  required: false,
  canBeGuildOwner: false,
  canBeAuthor: true,
  errors: {
    missingError: 'errors:invalidUser'
  }
}
const StringParameterOptions = {
  maxLength: 32,
  default: '',
  errors: {
    maxLength: 'commands:setnick.nameTooBig'
  }
}

class SetNick extends Command {
  constructor (client) {
    super(client, {
      name: 'setnick',
      aliases: ['nick', 'nickname', 'setnickname'],
      requirements: {
         permissions: ['MANAGE_NICKNAMES'],
        clientPermissions: ['MANAGE_NICKNAMES'],
        guildOnly: true,
        argsRequired: true }
    })
  }

  async run ({ args, author, guild, member, send, t }) {
    const parseMember = await MemberParameter.parse(args.shift(), MemberParameterOptions, {
      memberAuthor: member,
      commandName: this.name,
      author,
      guild
    })
    const name = (await StringParameter.parse(args.join(' '), StringParameterOptions)) || ''

    if (parseMember.displayName === name) throw new CommandError('commands:setnick.alreadySet', { user: parseMember, name })
    else if (!parseMember.nickname && !name) throw new CommandError('commands:setnick.alreadyReset', { user: parseMember })

    const renamedTo = (name && t('commands:setnick.success', { user: parseMember, name })) || t('commands:setnick.removedNickname', { user: parseMember })
    const reason = t('commands:setnick.reason', { author: author.tag })

    await parseMember.setNickname(name, reason).catch(() => {
      throw new CommandError('commands:setnick.failed')
    })

    const embed = new SimplicityEmbed({ author })
      .setDescription(renamedTo)
    return send(embed)
  }
}

module.exports = SetNick
