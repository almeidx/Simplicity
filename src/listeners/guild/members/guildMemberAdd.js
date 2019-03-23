const moment = require('moment')
const { Listener, Embed } = require('../../..')

class GuildMemberAdd extends Listener {
  constructor (client) {
    super(client)
  }

  on (_, member, t) { // aqui
    const guild = member.guild
    const user = member.user

    this.sendMessage('channel_log_start', // falta adicionar o coiso no Listener.js para a database
      new Embed({ t })
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
        .addField('loggers:joinedAt', moment().format('LLLL')))

    // .addField('Convidado por', `${inviter} usando o convite: ${invite.url} (${invite.uses} usos)`)
  }
}

module.exports = GuildMemberAdd
