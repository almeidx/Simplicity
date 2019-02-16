const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class Invite extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['inv', 'div']
    this.category = 'server'
  }
  async run ({ guild, author, message, send, t, args }) {
    const user = message.mentions.users.first() || guild.members.get([args[0]]) || author
    var targetInvites = await guild.fetchInvites()
    var invitesUses = 0
    targetInvites.forEach(invite => {
      if (invite.inviter.id === user.id) {
        invitesUses += invite.uses
      }
    })
    const embed = new MessageEmbed()
      .addField(t('commands:invite.invitedMembers'), invitesUses)
    send(embed)
  }
}
module.exports = Invite
