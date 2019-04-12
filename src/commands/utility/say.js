const { Command } = require('../../')

class Say extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'send' ]
    this.category = 'util'
    this.requirements = { argsRequired: true }
    this.responses = { argsRequired: 'commands:say.error' }
  }

  async run ({ channel, client, message, query, send }) {
    if (channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) await message.delete()
    await send(query)
  }
}

module.exports = Say
