const { Command, Embed, CommandError } = require('../..')

class Prefix extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.requirements = {
      argsRequired: true,
      permissions: ['MANAGE_GUILD'] }
  }

  async run ({ author, client, guild, query: [prefix], send, t }) {
    const embed = new Embed({ author, t })
    const count = 15

    if (prefix.length > count) throw new CommandError('commands:prefix.multiCharacters', { count })

    const data = await client.database.guilds.edit(guild.id, { prefix })

    if (!data) throw new CommandError('commands:prefix.failed')

    embed
      .setTitle('commands:prefix.done')
      .setDescription('commands:prefix.success', { prefix: query })

    return send(embed)
  }
}

module.exports = Prefix
