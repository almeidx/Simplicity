const { Command, SimplicityEmbed, Parameters, CommandError } = require('../../')
const { MemberParameter } = Parameters
const MemberParameterOptions = {
  required: true,
  canBeAuthor: false,
  canBeGuildOwner: false,
  errors: {
    missingError: 'errors:invalidUser'
  }
}

class VoiceKick extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'voicekick', 'vkick', 'kickvoice', 'kickvc' ]
    this.category = 'mod'
    this.requirements = {
      argsRequired: true,
      permissions: [ 'KICK_MEMBERS' ],
      clientPermissions: [ 'MANAGE_CHANNELS', 'MOVE_MEMBERS' ] }
  }

  async run ({ author, guild, member: memberAuthor, query, send, t }) {
    const member = await MemberParameter.parse(query, MemberParameterOptions, {
      memberAuthor,
      commandName: this.name,
      author,
      guild
    })
    await MemberParameter.verifyExceptions(member, MemberParameterOptions, {
      guild,
      memberAuthor,
      commandName: this.name
    })

    if (member.voice && !member.voice.channel)
      throw new CommandError('errors:noVoiceChannel')

    const oldChannelName = member.voice.channel.name
    const channelName = t('commands:vckick.voiceKicked', { user: author.tag })
    const reason = t('commands:vckick.reason', { author: author.tag, user: member.user.tag })

    const channel = await guild.channels.create(channelName, {
      type: 'voice',
      reason,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['VIEW_CHANNEL']
        }
      ]
    })

    await member.setVoiceChannel(channel)
    await channel.delete(reason)

    const embed = new SimplicityEmbed({ author, t })
      .setDescription(t('commands:vckick.success', { author, user: member, oldChannelName }))
    return send(embed)
  }
}

module.exports = VoiceKick
