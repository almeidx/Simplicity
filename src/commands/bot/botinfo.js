const { Command, Embed } = require('../../')
const { version } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

class BotInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['bi']
    this.category = 'bot'
    this.requirements = { clientPermissions: ['EMBED_LINKS'] }
  }
  run ({ t, emoji, send, guild }) {
    const UPTIME = moment.duration(this.client.uptime).format(`D[ ${t('utils:date.days')}], H[ ${t('utils:date.hours')}], m[ ${t('utils:date.minutes')}], s[ ${t('utils:date.seconds')}]`)
    const CPU = (process.cpuUsage().user / 1024 / 1024).toFixed(2)
    const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    const PLATFORM = process.platform[0].toUpperCase() + process.platform.slice(1)

    const embed = new Embed({ t, emoji, autoAuthor: false })
      .setTitle('commands:botinfo.botinfo')
      .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }))
      .addField('Ping', `${Math.floor(this.client.ws.ping)}ms`, true, { emoji: 'PING' })
      .addField('commands:botinfo.guildAndUsers', `${this.client.guilds.size} | ${this.client.users.size}`, true, { emoji: 'USERS' })
      .addField('commands:botinfo.channelAndEmojis', `${this.client.channels.size} | ${this.client.emojis.size}`, true, { emoji: 'HASH' })
      .addField('CPU | RAM', `${CPU}mb | ${RAM}mb`, true, { emoji: 'RAM' })
      .addField('Discord.js | Node.js', `${version} | ${process.versions.node}`, true, { emoji: 'BOOKS' })
      .addField('commands:botinfo.os', PLATFORM, true, { emoji: 'PC' })
      .addField('commands:botinfo.uptime', UPTIME, true, { emoji: 'WATCH' })
      .addField('commands:botinfo.commands', this.client.commands.size, true, { emoji: 'COMMANDS' })
      .addField('commands:botinfo.pings', guild.shard.pings.join(', '), true, { emoji: 'PINGS' })
    send(embed)
  }
}
module.exports = BotInfo
