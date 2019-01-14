const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class Invite extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['inv']
    this.category = 'server'
    this.requirements = { argsRequired: true }
  }

  async run ({ message, args }) {
    var user = message.mentions.users.first() || message.guild.members.get([args[0]]) || message.author
    var targetInvites = await message.guild.fetchInvites()
    var invitesUses = 0
    targetInvites.forEach(invite => {
      if (invite.inviter.id === user.id) {
        invitesUses += invite.uses
      }
    })
    var embed = new MessageEmbed()
      .addField('Invited members:', invitesUses)
      .setColor(process.env.COLOR)
      .setFooter(user.tag)
      .setTimestamp()
    message.channel.send(embed)
  }
}

module.exports = Invite
