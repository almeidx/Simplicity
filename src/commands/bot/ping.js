const { Command } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.category = 'bot'
  }

  async run ({ message, channel, guild, t }) {
    const msg = await channel.send(t('commands:ping.loading'))

    const host = msg.createdTimestamp - message.createdTimestamp
    const api = Math.round(guild.shard.ping)

    msg.edit(t('commands:ping.success', { host, api }))
  }
}

module.exports = Ping
