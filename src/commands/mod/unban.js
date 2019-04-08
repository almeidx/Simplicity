const { Command, SimplicityEmbed } = require('../../')

class Unban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ub']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['BAN_MEMBERS'], clientPermissions: ['BAN_MEMBERS'] }
  }

  run ({ author, send, guild, t, args }) {
    const embed = new SimplicityEmbed()
      .setAuthor(author.username, author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')

    const reason = args.slice(1)
    let title = t('errors:general')
    let msg

    if (args[0].match('(^[0-9}*$)')) {
      try {
        this.client.users.fetch(args[0])
          .then(u => {
            guild.unban(args[0], { reason: author.tag + ' | ' + (reason || t('commands:unban.noReason')) })
            title = t('commands:unban.success')
            msg = t('commands:unban.userUnbanned', { tag: u.user.tag })
            embed
              .addField('Unbanned by:', author, true)
              .addField(t('commands:unban.reason'), reason || 'No reason provided.')
              .setColor(process.env.COLOR)
              .setThumbnail(u.user.displayAvatarURL({ size: 2048 }))
          })
      } catch (err) {
        msg = t('commands:unban.noUser')
      }
    } else {
      msg = t('commands:unban.badID')
    }

    embed
      .setTitle(title)
      .setDescription(msg)

    send(embed)
  }
}

module.exports = Unban
