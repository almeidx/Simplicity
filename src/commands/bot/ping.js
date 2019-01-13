const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.description = 'This command shows you the ping of the bot.'
    this.usage = `Usage: **${process.env.PREFIX}ping**`
    this.category = 'Bot'
    this.argsRequired = false
  }
  run (message) {
    message.channel.send('Ping...')
      .then(msg => {
        msg.edit(`**Latency:** ${msg.createdTimestamp - message.createdTimestamp} ms\n**API Latency:** ${Math.floor(this.client.ws.ping)} ms`)
      })
  }
}

module.exports = Ping
