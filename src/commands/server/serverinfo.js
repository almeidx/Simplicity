const { Command, Embed } = require('../..')
const moment = require('moment')

class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['si', 'server']
    this.category = 'server'
  }
  run ({ author, guild, channel, t }) {
    const available = guild.members.filter(user => user.presence.status !== 'offline').size
    const offline = guild.members.filter(user => user.presence.status === 'offline').size
    const bots = guild.members.filter(user => user.user.bot).size
    const members = guild.memberCount
    const channels = guild.channels.filter(ch => ch.type === 'text' || ch.type === 'voice').size
    const emojis = guild.emojis.size
    const roles = guild.roles.size
    const verificationLevel = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻'][guild.verificationLevel]
    const verificationName = ['Unrestricted.', 'Must have a verified email on their Discord account.', 'Must be registered on Discord for longer than 5 minutes.', 'Must be a member of the server for longer than 10 minutes.', 'Must have a verified phone on their Discord account.'][guild.verificationLevel]
    const embed = new Embed({ t, guild })
      .addField('commands:serverinfo.name', guild.name, true)
      .addField('commands:serverinfo.owner', guild.owner, true)
      .addField('commands:serverinfo.id', guild.id, true)
      .addField('commands:serverinfo.created', moment(guild.createdAt).format('LL'))
      .addField(t('commands:serverinfo.members', { members }), `**${t('commands:serverinfo.available')}:** ${available}\n**${t('utils:status.offline')}:** ${offline}\n${t('utils:bots')}:** ${bots}`, true)
      .addField('commands:serverinfo.channelsEmojisRoles', `${channels} | ${emojis} | ${roles}`, true)
      .addField(`${t('commands:serverinfo.verificationLevel')}: ${verificationLevel}`, verificationName)
      .setThumbnail(guild.iconURL())
      .setFooter(`${t('utils:footer')} ${author.tag}`, author.displayAvatarURL({ size: 2048 }))
    channel.send(embed)
  }
}
module.exports = ServerInfo
