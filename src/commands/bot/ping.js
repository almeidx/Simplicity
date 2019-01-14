const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.category = 'bot'
  }
  run ({ message }) {
    message.channel.send('Ping...')
  }
}

module.exports = Ping
