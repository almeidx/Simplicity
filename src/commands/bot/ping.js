const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'pong' ]
    this.category = 'bot'
  }

  run ({ send, guild, t }) {
    send(t('commands:ping.success', { ping: Math.ceil(guild.shard.ping) }))
  }
}

module.exports = Ping
