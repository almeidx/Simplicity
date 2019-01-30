/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
moment.locale('pt-BR')
module.exports = async function guildMemberAdd (member) {
  const chan = member.guild.channels.find(ch => ch.name === 'modlog')
  const chann = member.guild.channels.get('538787820790087680')
  const embed = new MessageEmbed()
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ size: 2048 }))
    .setColor(process.env.COLOR)
    .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 2048 }))
    .setFooter(`Total de membros: ${member.guild.memberCount}`, member.guild.iconURL({ size: 2048 }))
  /* member.guild.fetchInvites()
    .then(inv => {
      const ei = invites[member.guild.id]
      invites[member.guild.id] = inv
      const invite = inv.find(i => ei.get(i.code).uses < i.uses)
      const inviter = this.users.get(invite.inviter.id) */
  if (chan) {
    embed.addField('Usuário', `${member} (${member.id})`)
      .addField('Criado em', `${moment(member.user.createdAt).format('LLLL')} (\`${moment(member.user.createdAt).fromNow()}\`)`)
      .addField('Entrou em', moment().format('LLLL'))
      // .addField('Convidado por', `${inviter} usando o convite: ${invite.url} (${invite.uses} usos)`)
    chan.send(embed)
      .catch(() => {})
  }
  if (chann) {
    chann.send(`${member} Seja bem vindo(a) ao servidor **${member.guild.name}**. Leia as ${member.guild.channels.get('538787784022818817') || 'regras'} e pegue o seu registro em ${member.guild.channels.get('538787772048211968') || 'chat de registro'} ${this.emojis.get('538807899330183171')}`)
  }
}// )
