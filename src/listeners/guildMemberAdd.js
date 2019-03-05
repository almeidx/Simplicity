const { Embed, LogUtils } = require('discord.js')
const moment = require('moment')

async function guildMemberAdd (member) {
  const guild = member.guild
  const { channel, t } = await LogUtils.getChannel(this, guild, 'JOIN_AND_LEAVE')
  const user = member.user

  if (channel) {
    const embed = new Embed({ t })
      .setTimestamp()
      .setColor(process.env.COLOR)
      .setAuthor(user.tag, user.displayAvatarURL())
      .setThumbnail(user.displayAvatarURL())
      .setFooter('loggers:totalMembers', guild.iconURL(), { count: guild.memberCount })

    /* member.guild.fetchInvites()
     * .then(inv => {
     * const ei = invites[member.guild.id]
     * invites[member.guild.id] = inv
     * const invite = inv.find(i => ei.get(i.code).uses < i.uses)
     * const inviter = this.users.get(invite.inviter.id)
     */

      .addField('loggers:user', `${user} (${user.id})`)
      .addField('loggers:accountCreatedAt', `${moment(user.createdAt).format('LLLL')} (${moment(user.createdAt).fromNow()})`)
      .addField('loggers:joinedAt', moment().format('LLLL'))

    // .addField('Convidado por', `${inviter} usando o convite: ${invite.url} (${invite.uses} usos)`)

    LogUtils.send(channel, embed)
  }
}

module.exports = guildMemberAdd
