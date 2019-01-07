const { MessageEmbed } = require('discord.js')
const Command = require('../structures/Command')
const moment = require('moment')

class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['si', 'server']
    this.description = 'This command shows the server icon.'
    this.usage = `Usage: **${process.env.PREFIX}servericon**`
    this.category = 'Server'
    this.argsRequired = false
  }
  run (message) {
    let online = message.guild.members.filter(user => user.presence.status === 'online').size
    let idle = message.guild.members.filter(user => user.presence.status === 'idle').size
    let dnd = message.guild.members.filter(user => user.presence.status === 'dnd').size
    let offline = message.guild.members.filter(user => user.presence.status === 'offline').size
    let bots = message.guild.members.filter(user => user.user.bot).size
    let members = message.guild.memberCount
    let text = message.guild.channels.filter(ch => ch.type === 'text').size
    let voice = message.guild.channels.filter(ch => ch.type === 'voice').size
    let emojis = message.guild.emojis.size
    let roles = message.guild.roles.size
    let verificationLevel = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻'][message.guild.verificationLevel]
    let verificationName = ['Unrestricted.', 'Must have a verified email on their Discord account.', 'Must be registered on Discord for longer than 5 minutes.', 'Must be a member of the server for longer than 10 minutes.', 'Must have a verified phone on their Discord account.'][message.guild.verificationLevel]
    let embed = new MessageEmbed()
      .addField('» Name:', message.guild.name, true)
      .addField('» Owner:', `<@${message.guild.owner.id}>`, true)
      .addField('» ID:', message.guild.id, true)
      .addField('» Created:', moment(message.guild.createdAt).format('LLLL'))
      .addField(`» Members (${members})`, `**Online:** ${online}\n**Idle:** ${idle}\n**Do Not Disturb:** ${dnd}\n**Offline:** ${offline}\n**Bots:** ${bots}`, true)
      .addField(`» Channels | Emojis | Roles`, `${text + voice} | ${emojis} | ${roles}`, true)
      .addField(`» Verification Level: ${verificationLevel}`, verificationName)
      .setThumbnail(message.guild.iconURL({ size: 2048 }))
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
      .setColor('#0494bc')
      .setTimestamp()
    message.channel.send(embed)
  }
}

module.exports = ServerInfo
