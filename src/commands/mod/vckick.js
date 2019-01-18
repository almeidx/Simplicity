const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class VoiceKick extends Command {
  constructor (client) {
    super(client)
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['KICK_MEMBERS'], clientPermissions: ['MANAGE_CHANNELS', 'MOVE_MEMBERS'] }
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
  async run ({ message, args }) {
    let mem = this.getUser(message, args)
    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')
      .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
    if (!mem) {
      embed.setDescription(`Usage: **${process.env.PREFIX}vckick [@mention/id] <reason>**`)
        .setTitle('You didn\'t mention / used a valid ID!')
      return message.channel.send(embed)
    } else if (!mem.voiceChannel) {
      embed.setDescription('The user is not in a Voice Channel.')
        .setTitle('Denied!')
      return message.channel.send(embed)
    } else if (message.member.roles.highest.position <= mem.roles.highest.position) {
      embed.setDescription('You can\'t ban this user because they have the same or higher role as you.')
        .setTitle('Denied!')
      return message.channel.send(embed)
    } else if (message.guild.me.roles.highest.position <= mem.roles.highest.position) {
      embed.setDescription('I can\'t ban this user because they have the same or higher role as me.')
        .setTitle('Denied!')
      return message.channel.send(embed)
    } else {
      const chan = await message.guild.createChannel(`Voice Kicked `, 'voice', [
        { id: message.guild.id, deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] },
        { id: message.member.id, deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
      ])
      await mem.setVoiceChannel(chan)
      await chan.delete()
      embed.author(mem.tag, mem.displayAvatarURL({ size: 2048 }))
        .setDescription(`${message.author} has kicked ${mem} from a Voice Channel`)
      return message.channel.send(embed)
    }
  }
}
module.exports = VoiceKick
