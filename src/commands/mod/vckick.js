const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class VoiceKick extends Command {
  constructor (client) {
    super(client)
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['KICK_MEMBERS'], clientPermissions: ['MANAGE_CHANNELS', 'MOVE_MEMBERS'] }
  }
  async run ({ author, guild, send, message, member, t, args }) {
    let mem = this.getUser(message, args)
    let embed = new MessageEmbed()
      .setAuthor(author.tag, author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')
    if (!mem) {
      embed.setDescription(t('commands:vckick.usage'))
        .setTitle(t('errors:invalidUser'))
      return send(embed)
    } else if (!mem.voiceChannel) {
      embed.setDescription(t('errors:noVoiceChannel'))
        .setTitle(t('errors:denied'))
      return send(embed)
    } else if (message.member.roles.highest.position <= mem.roles.highest.position) {
      embed.setDescription(t('errors:userMissingRole', { action: t('commands:vckick.action') }))
        .setTitle(t('errors:denied'))
      return send(embed)
    } else if (message.guild.me.roles.highest.position <= mem.roles.highest.position) {
      embed.setDescription(t('errors:clientMissingRole', { action: t('commands:vckick.action') }))
        .setTitle(t('errors:denied'))
      return send(embed)
    } else {
      const chan = await guild.createChannel(`Voice Kicked`, 'voice', [
        { id: guild.id, deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] },
        { id: member.id, deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
      ])
      await mem.setVoiceChannel(chan)
      await chan.delete()
      embed.author(mem.tag, mem.displayAvatarURL({ size: 2048 }))
        .setDescription(t('commands:vckick.success', { auth: author, memb: mem }))
      return send(embed)
    }
  }
  getUser (message, [query = null]) {
    let member = message.mentions.members.first()
    let checkMention = new RegExp('(^<@[0-9]*>)', 'g').test(query)
    if (member && checkMention) {
      return member
    }
    member = message.guild.member(query)
    if (member) {
      return member
    }
  }
}
module.exports = VoiceKick
