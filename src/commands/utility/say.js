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
    const checkPerms = (u, p) => channel.permissionsFor(u).has(p)
    if (checkPerms(client.user, 'MANAGE_MESSAGES') && checkPerms(member, 'ADMINISTRATOR')) await message.delete()
    await send(query)
  }
}

module.exports = Say
