/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
module.exports = async function guildMemberAdd (member) {
  let chan = member.guild.channels.find(ch => ch.name === 'modlog')
  member.guild.fetchInvites()
    .then(inv => {
      const ei = invites[member.guild.id]
      invites[member.guild.id] = inv
      const invite = inv.find(i => ei.get(i.code).uses < i.uses)
      const inviter = this.users.get(invite.inviter.id)
      if (chan) {
        let embed = new MessageEmbed()
          .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 2048 }))
          .addField('User', `${member} (${member.id})`)
          .addField('Created At', `${moment(member.user.createdAt).format('LLLL')} (\`${moment(member.user.createdAt).fromNow()}\`)`)
          .addField('Joined At', moment().format('LLLL'))
          .addField('Convidado por', `${inviter} usando o convite: ${invite.url} (${invite.uses} usos)`)
          .setTimestamp()
          .setThumbnail(member.user.displayAvatarURL({ size: 2048 }))
          .setFooter(`Member Count: ${member.guild.memberCount}`, member.guild.iconURL({ size: 2048 }))
          .setColor(process.env.COLOR)
        chan.send(embed)
          .catch(err => console.log(err))
      }
    })
}
