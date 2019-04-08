const { Command, SimplicityEmbed, CommandError } = require('../..')

class Prefix extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_ROLE'] }
  }

  async run ({ message, guild, query, send, t }) {
    const embed = new SimplicityEmbed({ t, message })

    if (query.length > 15) throw new CommandError('commands:prefix.multiCharacters', { count: 15 })

    const data = await this.client.database.guilds.edit(guild.id, { prefix: query })

    if (!data) throw new CommandError('commands:prefix.failed')

    embed
      .setTitle('commands:prefix.done')
      .setDescription('commands:prefix.success', { prefix: query })

    send(embed)
  }
}

module.exports = Prefix
