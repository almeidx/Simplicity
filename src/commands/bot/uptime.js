const { Command } = require('../..')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

class Uptime extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ut', 'ontime']
    this.category = 'bot'
  }
  run ({ send, t }) {
    const duration = moment.duration(this.client.uptime).format('D[d], H[h], m[m], s[s]')
    const embed = new MessageEmbed()
      .setTitle(t('commands:uptime.onlineFor', { duration }))
    send(embed)
  }
}
module.exports = Uptime
