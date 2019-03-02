const { Embed } = require('discord.js')
const moment = require('moment')
module.exports = async function guildMemberAdd (member) {
  const guildData = await this.database.guilds.get(member.guild.id)
  const logData = guildData && guildData.logs && guildData.logs.find(e => e.logName === 'JOIN_AND_LEAVE')
  const channel = logData && logData.channelID && member.guild.channels.get(logData.channelID)

  if (channel) {
    const t = this.i18next.getFixedT(guildData.lang || process.env.DEFAULT_LANG)

    const embed = new Embed({ t })
      .setTimestamp()
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setFooter(member.user.id)
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
      .addField('Usuário', `${member} (${member.id})`)
      .addField('Criado em', `${moment(member.user.createdAt).format('LLLL')} (\`${moment(member.user.createdAt).fromNow()}\`)`)
      .addField('Entrou em', moment().format('LLLL'))
      // .addField('Convidado por', `${inviter} usando o convite: ${invite.url} (${invite.uses} usos)`)
    channel.send(embed)
  }
}// )
