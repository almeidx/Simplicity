const { Command, CommandError, SimplicityEmbed, Utils } = require('../../')
const { getServerIconURL } = Utils

class Discriminator extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['discrim']
    this.category = 'util'
    this.requirements = {
      guildOnly: true
    }
  }

  async run ({ author, client, emoji, guild, query, send, t }) {
    let discrim
    if (!query) discrim = author.discriminator
    else discrim = query.replace(/#/g, '')

    const users = guild.members.filter((m) => m.user.discriminator === discrim)
    const mapped = users && users.map((u) => u.user.tag)
    if (!users || !users.size || !mapped) throw new CommandError('commands:discriminator.nobody')

    const final = mapped.slice(0, 25).join('\n') + (mapped.size > 25 ? '...' : '')
    const embed = new SimplicityEmbed({ author, t }, { autoAuthor: false })
      .setAuthor('commands:discriminator.users', getServerIconURL(guild), null, { discrim })
      .setDescription(final)
    return send(embed)
  }
}

module.exports = Discriminator
