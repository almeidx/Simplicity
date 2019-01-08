const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')
const { Command, Constants: { PLATFORMS } } = require('../')
const moment = require('moment')
require('moment-duration-format')

class BotInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bi']
    this.description = 'This command shows you info about myself.'
    this.usage = `Usage: **${process.env.PREFIX}botinfo**`
    this.category = 'Bot'
    this.argsRequired = false
  }

  run (message) {
    let uptime = moment.duration(this.client.uptime).format('D[d], H[h], m[m], s[s]')
    let cpu = (process.cpuUsage().user / 1024 / 1024).toFixed(2) // CPU Usage
    let ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) // RAM Usage
    let platform = PLATFORMS[process.platform]
    let pings = message.guild.shard.pings.join(', ')
    let array = []
    readdirSync('./commands').forEach((file) => {
      array.push(array.length + 1)
    })
    let commands = array.length
    const embed = new MessageEmbed()
      .setColor('#0494bc')
      .addField('» Ping', `${Math.floor(this.client.ws.ping)}ms`, true)
      .addField('» Guilds | Users', `${this.client.guilds.size} | ${this.client.users.size}`, true)
      .addField('» Channels | Emojis', `${this.client.channels.size} | ${this.client.emojis.size}`, true)
      .addField('» CPU | RAM', `${cpu}mb | ${ram}mb`, true)
      .addField('» Discord.js | Node.js', `${require('discord.js').version} | ${process.versions.node}`, true)
      .addField('» OS', platform, true)
      .addField('» Uptime', uptime, true)
      .addField('» Comandos', commands, true)
      .addField('» Last Pings', pings, true)
    message.channel.send(embed)
  }
}

module.exports = BotInfo
