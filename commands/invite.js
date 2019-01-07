const { MessageEmbed } = require('discord.js')
const Command = require('../structures/Command')

class Invite extends Command {
  constructor (name, client) {
    super(name, client)
    this.aliases = ['inv']
    this.description = 'This command shows how many persons you\'ve invited to the server.'
    this.usage = `Usage: **${process.env.PREFIX}inv <mention/id>**`
    this.category = 'Server'
    this.argsRequired = false
  }
  run (message, args) {
    var user = message.mentions.users.first() || message.guild.members.get([args[0]]) || message.author
    var targetInvites = message.guild.fetchInvites() // falta await aqui porem nsei onde coloco o async :ThinkPepe:
    var invitesUses = 0
    targetInvites.forEach(invite => {
      if (invite.inviter.id === user.id) {
        invitesUses += invite.uses
      }
    })
    var embed = new MessageEmbed()
      .addField('Invited members:', invitesUses)
      .setColor('RANDOM')
      .setFooter(user.tag)
      .setTimestamp()
    message.channel.send(embed)
  }
}

module.exports = Invite
