const { Command, SimplicityEmbed, CommandError } = require('../..')

class Prefix extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.requirements = {
      argsRequired: true,
      permissions: ['MANAGE_GUILD'] }
  }

  async run ({ author, client, guild, query: prefix, send, t }) {
    const embed = new SimplicityEmbed({ author, t })

    const amount = 15
    if (prefix.length > amount) throw new CommandError('commands:prefix.multiCharacters', { amount })

    const data = await client.database.guilds.edit(guild.id, { prefix })
    if (!data) throw new CommandError('commands:prefix.failed')

    embed
      .setTitle('commands:prefix.done')
      .setDescription('commands:prefix.success', { prefix })
    return send(embed)
  }
}

module.exports = Prefix
