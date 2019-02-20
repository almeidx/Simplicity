const { Command } = require('../../')

class Say extends Command {
  constructor (client) {
    super(client)
    this.category = 'general'
    this.requirements = { argsRequired: true }
  }
  async run ({ message, channel, query }) {
    if (channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) await message.delete()
    await channel.send(query)
  }
}
module.exports = Say
