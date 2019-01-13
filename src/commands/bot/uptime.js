const moment = require('moment')
require('moment-duration-format')
const { Command } = require('../..')

class Uptime extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ut', 'ontime']
    this.description = 'This command shows my uptime.'
    this.usage = `Usage: **${process.env.PREFIX}uptime**`
    this.category = 'Bot'
    this.argsRequired = false
  }
  run (message) {
    let duration = moment.duration(this.client.uptime).format('D[d], H[h], m[m], s[s]')
    message.channel.send(`I have been online for: **${duration}**`)
  }
}

module.exports = Uptime
