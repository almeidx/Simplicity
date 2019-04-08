const { Command, SimplicityEmbed } = require('../../')
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

  async run ({ author, client, emoji, guild, send, t }) {
    const UPTIME = moment.duration(this.client.uptime).format(`D[ ${t('utils:date.days')}], H[ ${t('utils:date.hours')}], m[ ${t('utils:date.minutes')}], s[ ${t('utils:date.seconds')}]`)
    const CPU = (process.cpuUsage().user / 1024 / 1024).toFixed(2)
    const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    const PLATFORM = process.platform[0].toUpperCase() + process.platform.slice(1)

    const link = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=379968`
    const guildData = await client.database.guilds.get(guild.id)
    const PREFIX = (guildData && guildData.prefix) || process.env.PREFIX

    const ownersId = process.env.DEVS_IDS.split(', ')
    const OWNERS = ownersId.map(i => client.users.get(i).tag).join(', ')

    const embed = new SimplicityEmbed({ author, guild, t, emoji })
      .addField('» $$commands:botinfo.ping', `${Math.round(guild.shard.ping)}ms`, true, { emoji: 'PING' })
      .addField('» $$commands:botinfo.guildAndUsers', `${this.client.guilds.size} | ${this.client.users.size}`, true, { emoji: 'USERS' })
      .addField('» $$commands:botinfo.channelsAndEmotes', `${this.client.channels.size} | ${this.client.emojis.size}`, true, { emoji: 'HASH' })
      .addField('» CPU | RAM', `${CPU}mb | ${RAM}mb`, true, { emoji: 'RAM' })
      .addField('» Discord.js | Node.js', `${version} | ${process.versions.node}`, true, { emoji: 'BOOKS' })
      .addField('» $$commands:botinfo.os', PLATFORM, true, { emoji: 'PC' })
      .addField('» $$commands:botinfo.prefix', PREFIX, true)
      .addField('» $$commands:botinfo.commands', this.client.commands.size, true, { emoji: 'COMMANDS' })
      .addField('» $$commands:botinfo.links', `#bot [$$commands:botinfo.inviteBot ](${link})`, true)
      .addField('» $$commands:botinfo.developers', OWNERS)
      .addField('» $$commands:botinfo.uptime', UPTIME, false, { emoji: 'WATCH' })
    return send(embed)
  }
}

module.exports = BotInfo
