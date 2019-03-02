const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.category = 'bot'
  }
  run ({ message, send, guild, t }) {
    send(t('commands:ping.loading'))
      .then(msg => {
        msg.edit(t('commands:ping.sucess', { HOST: msg.createdTimestamp - message.createdTimestamp, API: Math.round(guild.shard.ping) }))
      })
  }
}
module.exports = Ping
