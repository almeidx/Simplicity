const { Command, SimplicityEmbed } = require('../..')

class Logs extends Command {
  constructor (client) {
    super(client)
    this.name = 'language'
    this.aliases = ['log', 'logger', 'loggers', 'modlog', 'modlogs', 'eventlog', 'logevent']
    this.category = 'bot'
    this.requirements = {
      ownerOnly: true,
      permissions: ['MANAGE_GUILD'] }
  }

  async run ({ author, client, emoji, guild, query, send, t }) {
    const checkChannel = (c) => guild.channels.get(c) ? c : '#TICK_NO'

    const embed = new SimplicityEmbed({ author, emoji, t })
    const { logs } = await client.database.guilds.get(guild.id)
    const logTypes = Object.keys(logs)

    if (!query) {
      for (const i of logTypes) {
        if (i !== '$init') embed.addField(`» $$commands:logs.${i}`, checkChannel(i), true)
      }
      return send(embed)
    }
  }
}

module.exports = Logs
