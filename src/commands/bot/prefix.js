const { Command, Embed } = require('../..')

class Prefix extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_ROLE'] }
  }

  async run ({ message, guild, query, send, t }) {
    const embed = new Embed({ t, message })

    if (query.length > 10) {
      embed.setTitle('errors:denied')
        .setDescription('commands:prefix.multiCharacters')
        .setError()
      return send(embed)
    }

    try {
      const data = await this.client.database.guilds.edit(guild.id, { prefix: query })
      if (!data) throw new Error()
      embed.setTitle('commands:prefix.done')
        .setDescription('commands:prefix.sucess', { prefix: query })
      send(embed)
    } catch (err) {
      embed.setTitle('commands:prefix.oops')
        .setDescription('commands:prefix.failed')
        .setError()
      send(embed)
      console.log(err)
    }
  }
}

module.exports = Prefix
