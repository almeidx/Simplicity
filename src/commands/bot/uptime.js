const { Command, Utils, Embed } = require('../..')

class Uptime extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ut']
    this.category = 'bot'
  }

  run ({ author, send, t }) {
    const duration = Utils.convertDateLang(t, this.client.uptime)

    const embed = new Embed({ author, t })
      .setDescription('commands:uptime.onlineFor', { duration })

    send(embed)
  }
}

module.exports = Uptime
