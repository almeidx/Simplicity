const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'pong' ]
    this.category = 'bot'
  }

  run ({ channel, message, t }) {
    channel.send(t('commands:ping.loading')).then(msg => {
      msg.edit(t('commands:ping.success', { ping: msg.createdTimestamp - message.createdTimestamp }))
    })
  }
}

module.exports = Ping
