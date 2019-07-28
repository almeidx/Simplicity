const { Command, MessageCollectorUtils } = require('../../')

class Test extends Command {
  constructor (client) {
    super(client)
    this.category = 'dev'
    this.requirements = {
      ownerOnly: true }
  }

  async run ({ channel, message }) {
    const response = await MessageCollectorUtils.test(message, 'What?', 30000)
    if (!response)
      return channel.send('no response bruh')
    await channel.send(response)
  }
}

module.exports = Test
