const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')
const moment = require('moment')
require('moment-duration-format')

class BotInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bi']
    this.category = 'bot'
    this.requirements = { clientPermissions: ['EMBED_LINKS'] }
  }
  run ({ message, t, emoji, send }) {
    const UPTIME = moment.duration(this.client.uptime).format(`D[ ${t('utils:date.days')}], H[ ${t('utils:date.hours')}], m[ ${t('utils:date.minutes')}], s[ ${t('utils:date.seconds')}]`)
    const CPU = (process.cpuUsage().user / 1024 / 1024).toFixed(2)
    const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    const PLATFORM = process.platform.charAt(0).toUpperCase() + process.platform.slice(1)

    const embed = new MessageEmbed()
      .setTitle('commands:botinfo.botinfo')
      .setThumbnail(this.client.user.displayAvatarURL({ size: 2042 }))
      .addField(`${emoji('PING')} Ping`, `${Math.floor(this.client.ws.ping)}ms`, true)
      .addField(`${emoji('USERS')} ${t('commands:botinfo.guildAndUsers')}`, `${this.client.guilds.size} | ${this.client.users.size}`, true)
      .addField(`${emoji('HASH')} ${t('commands:botinfo.channelAndEmojis')}`, `${this.client.channels.size} | ${this.client.emojis.size}`, true)
      .addField(`${emoji('RAM')} CPU | RAM`, `${CPU}mb | ${RAM}mb`, true)
      .addField(`${emoji('BOOKS')} Discord.js | Node.js`, `${require('discord.js').version} | ${process.versions.node}`, true)
      .addField(`${emoji('PC')} ${t('commands:botinfo.os')}`, PLATFORM, true)
      .addField(`${emoji('WATCH')} ${t('commands:botinfo.uptime')}`, UPTIME, true)
      .addField(`${emoji('COMMANDS')} ${t('commands:botinfo.commands')}`, this.client.commands.size, true)
      .addField(`${emoji('PINGS')} ${t('commands:botinfo.pings')}`, message.guild.shard.pings.join(', '), true)
    send(embed)
  }
}

module.exports = BotInfo
