const { Command, Embed } = require('../..')
const moment = require('moment')

class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['si', 'server', 'svinfo', 'sv', 'guild']
    this.category = 'guild'
  }
  run ({ author, guild, send, t }) {
    // Members
    const online = guild.members.filter(user => user.presence.status !== 'offline' && !user.user.bot).size
    const offline = guild.members.filter(user => user.presence.status === 'offline' && !user.user.bot).size
    const bots = guild.members.filter(user => user.user.bot).size
    const members = guild.memberCount

    // Channels
    const text = guild.channels.filter(channel => channel.type === 'text').size
    const voice = guild.channels.filter(channel => channel.type === 'voice').size
    const category = guild.channels.filter(channel => channel.type === 'category').size

    const emojis = guild.emojis.size
    const roles = guild.roles.size
    const embed = new Embed({ t, guild, author })
      .addField('commands:serverinfo.name', guild.name, true)
      .addField('commands:serverinfo.owner', guild.owner.user.tag, true)
      .addField('commands:serverinfo.id', guild.id, true)
      .addField('commands:serverinfo.created', moment(guild.createdAt).format('LLL'), true)
      .addField('commands:serverinfo.Channels', `${text} | ${voice} | ${category}`, true)
      .addField('commands:serverinfo.EmojisRoles', `${emojis} | ${roles}`, true)
      .addField('commands:serverinfo.onlineOfflineBotsTotal', `${online} | ${offline} | ${bots} | ${members}`, true)
      .addField('commands:serverinfo.verificationLevel', `commands:serverinfo.verificationDetails.${guild.verificationLevel}`, true, { level: guild.verificationLevel })
      .setThumbnail(guild.iconURL({ size: 2048 }))
    send(embed)
  }
}
module.exports = ServerInfo
