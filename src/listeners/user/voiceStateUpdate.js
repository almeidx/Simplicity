const { SimplicityListener, SimplicityEmbed } = require('../../index')

class VoiceStateUpdate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (_, oldState, newState, t) {
    const user = oldState.member.user
    const oldChannel = oldState.channel && `**${oldState.channel.name}**`
    const newChannel = newState.channel && `**${newState.channel.name}**`

    const embed = new SimplicityEmbed({ t })
      .setTimestamp()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setFooter(user.id)

    // LEAVE CHANNEL
    if (oldChannel && !newChannel) {
      embed.setDescription('loggers:leaveVoiceChannel', { user, channel: oldChannel })
      return this.sendMessage('leaveVoiceChannel', embed).catch(() => null)
    } else
    // JOIN CHANNEL
    if (!oldChannel && newChannel) {
      embed.setDescription('loggers:joinVoiceChannel', { user, channel: newChannel })
      return this.sendMessage('joinVoiceChannel', embed).catch(() => null)
    } else {
    // MOVED CHANNEL
      embed.setDescription('loggers:hasChangedVoiceChannel', { user, newChannel, oldChannel })
      return this.sendMessage('movedVoiceChannel', embed).catch(() => null)
    }
  }
}

module.exports = VoiceStateUpdate
