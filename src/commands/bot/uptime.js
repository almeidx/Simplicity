const { Command, Utils, Embed } = require('../..')

class Uptime extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ut', 'ontime']
    this.category = 'bot'
  }

  run ({ send, t }) {
    const duration = Utils.convertDateLang(t, this.client.uptime)

    const embed = new Embed({ t })
      .setDescription('commands:uptime.onlineFor', { duration })

    send(embed)
  }
}

module.exports = Uptime
