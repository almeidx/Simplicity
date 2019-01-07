const { MessageEmbed } = require('discord.js')
const { PLATFORMS } = require('../utils/Constants')
const Command = require('../structures/Command')
const moment = require('moment')
require('moment-duration-format')

class BotInfo extends Command {
  constructor (name, client) {
    super(name, client)
    this.aliases = ['bi']
    this.description = 'This command shows you info about myself.'
    this.usage = `Usage: **${process.env.PREFIX}botinfo**`
    this.category = 'Bot'
    this.argsRequired = false
  }

  run (message, args) {
    let uptime = moment.duration(this.client.uptime).format('D[d], H[h], m[m], s[s]')
    let cpu = (process.cpuUsage().user / 1024 / 1024).toFixed(2) // CPU Usage
    let ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) // RAM Usage
    let platform = PLATFORMS[process.platform]
    let pings = message.guild.shard.pings.join(', ')
    const embed = new MessageEmbed()
      .setColor('#0494bc')
      .addField('» Ping', `${Math.floor(this.client.ws.ping)}ms`, true)
      .addField('» Guilds | Users', `${this.client.guilds.size} | ${this.client.users.size}`, true)
      .addField('» Channels | Emojis', `${this.client.channels.size} | ${this.client.emojis.size}`, true)
      .addField('» CPU | RAM', `${cpu}mb | ${ram}mb`, true)
      .addField('» Discord.js | Node.js', `${require('discord.js').version} | ${process.versions.node}`, true)
      .addField('» OS', platform, true)
      .addField('» Uptime', uptime, true)
      .addField('» Comandos', 'merda', true) // colocar aqui a quantidade de comandos @Tsugami
      .addField('» Last Pings', pings, true)
    message.channel.send(embed)
  }
}

module.exports = BotInfo
