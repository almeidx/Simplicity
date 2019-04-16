const { Command } = require('../../')

class Say extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'send' ]
    this.category = 'util'
    this.requirements = { argsRequired: true }
    this.responses = { argsRequired: 'commands:say.error' }
  }

  async run ({ channel, client, message, member, query, send }) {
    const checkPerms = (u) => channel.permissionsFor(u).has('MANAGE_MESSAGES')
    if (checkPerms(client.user) && checkPerms(member)) await message.delete()
    await send(query)
  }
}

module.exports = Say
