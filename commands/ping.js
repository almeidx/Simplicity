const Command = require('../structures/Command')

class Ping extends Command {
  constructor (name, client) {
    super(name, client)
    this.aliases = ['pong']
    this.description = 'This command shows you the ping of the bot.'
    this.usage = `Usage: **${process.env.PREFIX}ping**`
    this.category = 'Bot'
    this.argsRequired = false
  }
  run (message, args) {
    message.channel.send('Ping...')
      .then(msg => {
        msg.edit(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.floor(this.client.ws.ping)}ms.`)
      })
  }
}

module.exports = Ping
