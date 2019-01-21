const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.category = 'bot'
  }
  run ({ message, t }) {
    message.channel.send('.')
      .then(msg => {
        msg.edit(t('commands:ping.sucess', { HOST: msg.createdTimestamp - message.createdTimestamp, API: this.client.ws.ping }))
      })
  }
}
module.exports = Ping
