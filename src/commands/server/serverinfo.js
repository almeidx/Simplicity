const { Command, Embed } = require('../..')
const moment = require('moment')

class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['si', 'server']
    this.category = 'server'
  }
  run ({ author, guild, channel, t }) {
    const online = guild.members.filter(user => user.presence.status !== 'offline').size
    const offline = guild.members.filter(user => user.presence.status === 'offline').size
    const bots = guild.members.filter(user => user.user.bot).size
    const members = guild.memberCount
    const channels = guild.channels.filter(ch => ch.type === 'text' || ch.type === 'voice').size
    const emojis = guild.emojis.size
    const roles = guild.roles.size
    const verificationLevel = [t('commands:serverinfo.none'), t('commands:serverinfo.low'), t('commands:serverinfo.medium'), '(╯°□°）╯︵ ┻━┻', '┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻'][guild.verificationLevel]
    const verificationName = [t('commands:serverinfo.unrestricted'), t('commands:serverinfo.levelTwo'), t('commands:serverinfo.levelThree'), t('commands:serverinfo.levelFour'), t('commands:serverinfo.levelFive')][guild.verificationLevel]
    const embed = new Embed({ t, guild, author })
      .addField('commands:serverinfo.name', guild.name, true)
      .addField('commands:serverinfo.owner', guild.owner.user.tag, true)
      .addField('commands:serverinfo.id', guild.id, true)
      .addField('commands:serverinfo.created', moment(guild.createdAt).format('LLL'), true)
      .addField('commands:serverinfo.channelsEmojisRoles', `${channels} | ${emojis} | ${roles}`, true)
      .addField('commands:serverinfo.membersOnlineOfflineBots', `${members} | ${online} | ${offline} | ${bots}`, true)
      .addField(`${t('commands:serverinfo.verificationLevel')}: ${verificationLevel}`, verificationName)
      .setThumbnail(guild.iconURL({ size: 2048 }))
    channel.send(embed)
  }
}
module.exports = ServerInfo
