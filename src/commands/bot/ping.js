const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.category = 'bot'
  }
  run ({ message }) {
    message.channel.send('Calculating...')
      .then(msg => {
        msg.edit(`**Latency:** ${msg.createdTimestamp - message.createdTimestamp} ms\n**API Latency:** ${Math.floor(this.client.ws.ping)} ms`)
      })
  }
}
module.exports = Ping
