const { Command } = require('../../')

class Say extends Command {
  constructor (client) {
    super(client)
    this.category = 'general'
    this.requirements = { argsRequired: true }
  }
  async run ({ message, query }) {
    if (message.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) await message.delete()
    await message.channel.send(query)
  }
}
module.exports = Say
