const { Command, Embed, Parameters: { MemberParameter, UserParameter }, CommandError } = require('../../')
const missingError = 'errors:invalidUser'
const optionsParameter = {
  required: true,
  canBeAuthor: false,
  canBeGuildOwner: false,
  errors: {
    missingError
  }
}

class VoiceKick extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['voicekick', 'vkick']
    this.category = 'mod'
    this.requirements = {
      argsRequired: true,
      permissions: ['KICK_MEMBERS'],
      clientPermissions: ['MANAGE_CHANNELS', 'MOVE_MEMBERS']
    }
  }

  async run ({ args, author, client, guild, message, member: memberAuthor, send, t }) {
    const user = await UserParameter.search(args[0], { client, guild }, optionsParameter)
    const member = user && guild.member(user)

    if (!user) throw new CommandError(missingError)

    const embed = new Embed({ author, t })
      .setColor('RED')

    if (member) {
      await MemberParameter.verifyExceptions(member, { guild, memberAuthor: member, commandName: this.name }, optionsParameter)
    }

    if (!(member && member.voice && member.voice.channel)) throw new CommandError('errors:noVoiceChannel')
    else {
      const oldChannelName = member.voice.channel.name
      const channelName = t('commands:vckick.voiceKicked', { user: author.tag })
      const reason = t('commands:vckick.reason', { author: author.tag, user: user.tag})

      const channel = await guild.channels.create(channelName, {
        type: 'voice',
        reason,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
          }
        ]
      })

      await member.setVoiceChannel(channel)
      await channel.delete({ reason })

      embed.setDescription(t('commands:vckick.success', { author, user, oldChannelName }))

      return send(embed)
    }
  }
}

module.exports = VoiceKick
