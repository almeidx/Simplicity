const { Command, SimplicityEmbed } = require('../../')
const { version } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

class BotInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'bi' ]
    this.category = 'bot'
    this.requirements = { clientPermissions: [ 'EMBED_LINKS' ] }
  }

  async run ({ author, client, emoji, guild, send, t }) {
    const UPTIME = moment.duration(this.client.uptime).format(`D[ ${t('common:date.days')}], H[ ${t('common:date.hours')}], m[ ${t('common:date.minutes')}], s[ ${t('common:date.seconds')}]`)
    const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)

    const link = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=379968`
    const guildData = await client.database.guilds.get(guild.id)
    const PREFIX = (guildData && guildData.prefix) || process.env.PREFIX

    const ownersId = process.env.DEVS_IDS.split(', ')
    const OWNERS = ownersId.map(i => client.users.get(i).tag).join(', ')

    const embed = new SimplicityEmbed({ author, guild, t, emoji })
      .addField('» $$commands:botinfo.ping', `${Math.round(guild.shard.ping)}ms`, true)
      .addField('» $$commands:botinfo.users', this.client.users.size, true)
      .addField('» $$commands:botinfo.guilds', this.client.guilds.size, true)
      .addField('» $$commands:botinfo.prefix', PREFIX, true)
      .addField('» $$commands:botinfo.ramUsage', `${RAM} mb`, true)
      .addField('» $$commands:botinfo.discordjs', version, true)
      .addField('» $$commands:botinfo.nodejs', process.versions.node, true)
      .addField('» $$commands:botinfo.commands', this.client.commands.size, true)
      .addField('» $$commands:botinfo.links', `#bot_tag [$$commands:botinfo.inviteBot ](${link})`, true)
      .addField('» $$commands:botinfo.developers', OWNERS)
      .addField('» $$commands:botinfo.uptime', UPTIME)
    return send(embed)
  }
}

module.exports = BotInfo
