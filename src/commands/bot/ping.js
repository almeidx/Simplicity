const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.category = 'bot'
  }
  run ({ message, send, t }) {
    send(t('commands:ping.loading'))
      .then(msg => {
        msg.edit(t('commands:ping.sucess', { HOST: msg.createdTimestamp - message.createdTimestamp, API: Math.round(this.client.ws.ping) }))
      })
  }
}
module.exports = Ping
