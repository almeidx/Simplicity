const { Command, Utils } = require('../..')
const { MessageEmbed } = require('discord.js')

class Uptime extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ut', 'ontime']
    this.category = 'bot'
  }
  run ({ send, t }) {
    const embed = new MessageEmbed()
      .setDescription(t('commands:uptime.onlineFor', { duration: Utils.convertDateLang(t, this.client.uptime) }))
    send(embed)
  }
}
module.exports = Uptime
