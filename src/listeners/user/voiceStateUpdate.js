const { Listener, SimplicityEmbed } = require('../../index')

class VoiceStateUpdate extends Listener {
  constructor (client) {
    super(client)
  }

  async on (client, oldState, newState) {
    const user = oldState.member.user
    const oldChannel = oldState.channel && `**${oldState.channel.name}**`
    const newChannel = newState.channel && `**${newState.channel.name}**`
    const { t } = await client.database.guilds.get(oldState.member.guild.id)

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
