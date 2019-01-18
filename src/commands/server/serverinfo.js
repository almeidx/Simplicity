const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')
const moment = require('moment')

class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['si', 'server']
    this.category = 'server'
  }
  run ({ author, guild, send, t }) {
    let online = guild.members.filter(user => user.presence.status === 'online').size
    let idle = guild.members.filter(user => user.presence.status === 'idle').size
    let dnd = guild.members.filter(user => user.presence.status === 'dnd').size
    let offline = guild.members.filter(user => user.presence.status === 'offline').size
    let bots = guild.members.filter(user => user.user.bot).size
    let members = guild.memberCount
    let channels = guild.channels.filter(ch => ch.type === 'text' || ch.type === 'voice').size
    let emojis = guild.emojis.size
    let roles = guild.roles.size
    let verificationLevel = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻'][guild.verificationLevel]
    let verificationName = ['Unrestricted.', 'Must have a verified email on their Discord account.', 'Must be registered on Discord for longer than 5 minutes.', 'Must be a member of the server for longer than 10 minutes.', 'Must have a verified phone on their Discord account.'][guild.verificationLevel]
    let embed = new MessageEmbed()
      .addField(t('commands:serverinfo.name'), guild.name, true)
      .addField(t('commands:serverinfo.owner'), guild.owner, true)
      .addField(t('commands:serverinfo.id'), guild.id, true)
      .addField(t('commands:serverinfo.created'), moment(guild.createdAt).format('LL'))
      .addField(t('commands:serverinfo.members', { members: members }), `**${t('utils:status.online')}:** ${online}\n**${t('utils:status.idle')}:** ${idle}\n**${t('utils:status.dnd')}:** ${dnd}\n**${t('utils:status.offline')}:** ${offline}\n**${t('utils:bots')}:** ${bots}`, true)
      .addField(t('commands:serverinfo.channelsEmojisRoles'), `${channels} | ${emojis} | ${roles}`, true)
      .addField(`${t('commands:serverinfo.verificationLevel')}: ${verificationLevel}`, verificationName)
      .setThumbnail(guild.iconURL({ size: 2048 }))
      .setFooter(`${t('utils:footer')} ${author.tag}`, author.displayAvatarURL({ size: 2048 }))
    send(embed)
  }
}
module.exports = ServerInfo
