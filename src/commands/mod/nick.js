const { Command, CommandError, MemberParameter, SimplicityEmbed, UserParameter } = require('../../')

const optionsParameter = {
  required: false,
  canBeAuthor: false,
  canBeGuildOwner: false,
  errors: {
    missingError
  }
}

class Nick extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['setnick', 'nickname', 'setnickname']
    this.category = 'mod'
    this.WIP = true
    this.requirements = {
      permissions: ['MANAGE_NICKNAMES'],
      clientPermissions: ['MANAGE_NICKNAMES'],
      guildOnly: true
    }
  }

  async run ({ args, author, channel, member, message, send, t }) {
    let m = await UserParameter.search(args[0], { guild })
    if (m) await MemberParameter.verifyExceptions(m, optionsParameter, { guild, memberAuthor: member, commandName: this.name })
    else m = member

    // .. to be continued
  }
}

module.exports = Nick
