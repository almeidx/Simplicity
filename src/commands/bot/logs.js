const { Command, SimplicityEmbed } = require('../..')
const checkTick = (c) => c ? 'TICK_YES' : 'TICK_NO'

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

  async run ({ author, client, guild, query, send, t }) {
    const embed = new SimplicityEmbed({ author, t })
    const { logs } = await client.database.guilds.get(guild.id)

    if (!query) {
      embed
        .addField('» $$commands:logs.userUpdates', checkTick(logs), true) // eu sei que está errado, é só um placeholder mesmo
      return send(embed)
    }

  }
}

module.exports = Logs
