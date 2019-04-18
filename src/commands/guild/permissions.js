const { Command, CommandError, Constants, Parameters, SimplicityEmbed } = require('../..')
const { MANAGER_PERMISSIONS } = Constants
const { UserParameter } = Parameters
const checkTick = (c) => c ? 'TICK_YES' : 'TICK_NO'
const optionsParameter = {
  required: true,
  canBeAuthor: true,
  checkGlobally: false,
  canBeGuildOwner: true,
  errors: {
    missingError: 'errors:invalidUser'
  }
}

class Permissions extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['perms', 'perm', 'permission']
    this.category = 'guild'
  }

  async run ({ author, client, emoji, guild, query, send, t }) {
    const user = !query ? author : await UserParameter.search(query, { client, guild }, optionsParameter)
    const member = user && guild.member(user)
    if (!member) throw new CommandError('errors:invalidUser')

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setAuthor('commands:permissions.author', user.displayAvatarURL(), null, { user: user.tag })

    for (const p of MANAGER_PERMISSIONS) {
      embed.addField(`permissions:${p}`, `#${checkTick(member.permissions.has(p))}`, true)
    }

    return send(embed)
  }
}

module.exports = Permissions
