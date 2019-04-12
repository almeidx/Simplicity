const { Command, SimplicityEmbed, CommandError } = require('../../')
const ID_REGEX = /^([0-9]{16,18})/g

class Kick extends Command {
  constructor (client) {
    super(client)
    this.category = 'mod'
    this.requirements = {
      argsRequired: true,
      permissions: [ 'KICK_MEMBERS' ],
      clientPermissions: [ 'KICK_MEMBERS' ] }
  }

  async run ({ author, guild, send, message, member, t, query }) {
    let guilty
    const id = query.match(ID_REGEX)

    if (message.mentions.members.size >= 1 && query.startsWith(message.mentions.members.first().toString())) {
      guilty = message.mentions.members.first()
    } else if (query && guild.member(id)) {
      guilty = guild.member(id)
    }

    if (!guilty) {
      throw new CommandError('errors:invalidUser')
    }

    if (guild.me.roles.highest.position <= guilty.roles.highest.position) {
      throw new CommandError('errors:clientMissingRole', { action: t('commands:kick.action') })
    }

    if (member.roles.highest.position <= guilty.roles.highest.position) {
      throw new CommandError('errors:userMissingRole', { action: t('commands:kick.action') })
    }

    const reason = query.replace(new RegExp(`^(${guilty}|${id})`, 'g'), '').trim() || t('errors:noReason')
    await guilty.kick(`${author.tag} [${author.id}] | ${reason}`)

    const embed = new SimplicityEmbed({ t, author })
      .setTitle('commands:kick.success')
      .setDescription('commands:kick.userKicked', { user: guilty })
      .addField('commands:kick.kickedBy', author, true)
      .addField('commands:kick.reason', reason)
      .setThumbnail(author.displayAvatarURL({ size: 2048 }))

    send(embed)
  }
}

module.exports = Kick
