const { Embed, LogUtils } = require('../src')

async function voiceStateUpdate (oldState, newState) {
  const { channel, t } = await LogUtils.getChannel(this, oldState.guild, 'JOIN_AND_LEAVE')

  if (channel) {
    const user = oldState.member.user
    const oldChannel = oldState.channel && `**${oldState.channel.name}**`
    const newChannel = newState.channel && `**${newState.channel.name}**`

    const embed = new Embed({ t })
      .setTimestamp()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setFooter(user.id)

    // LEAVE CHANNEL
    if (oldChannel && !newChannel) {
      embed.setDescription('loggers:leaveVoiceChannel', { user, channel: oldChannel })
      return LogUtils.send(channel, embed).catch(e => console.error(e))
    } else
    // JOIN CHANNEL
    if (!oldChannel && newChannel) {
      embed.setDescription('loggers:joinVoiceChannel', { user, channel: newChannel })
      return LogUtils.send(channel, embed).catch(e => console.error(e))
    } else {
    // CHANGED CHANNEL
      embed.setDescription('loggers:hasChangedVoiceChannel', { user, newChannel, oldChannel })
      return LogUtils.send(channel, embed).catch(e => console.error(e))
    }
  }
}

module.exports = voiceStateUpdate
