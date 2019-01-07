const { MessageEmbed } = require('discord.js')
module.exports = {
  run: async function (message, client, args) {
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
      .setColor('RANDOM')
      .setFooter(user.tag)
      .setTimestamp()
    message.channel.send(embed)
  }
}
