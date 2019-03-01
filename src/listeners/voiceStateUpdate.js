const { Embed } = require('../')
module.exports = async function voiceStateUpdate (oldState, newState) {
  const guildData = await this.database.guilds.get(oldState.guild.id)
  const logData = guildData && guildData.logs && guildData.logs.find(e => e.logName === 'JOIN_AND_LEAVE')
  const channel = logData && logData.channelID && oldState.guild.channels.get(logData.channelID)

  if (channel) {
    const t = this.i18next.getFixedT(guildData.lang || process.env.DEFAULT_LANG)
    const user = oldState.member.user
    const oldChannel = oldState.channel && `**${oldState.channel.name}**`
    const newChannel = newState.channel && `**${newState.channel.name}**`
    const embed = new Embed({ t })
      .setTimestamp()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setFooter(user.id)

    // LEAVE CHANNEL
    if (oldChannel && !newChannel) {
      embed.setDescription('loggers:leaveVoiceChannel', { user: user, channel: oldChannel })
      return channel.send(embed)
    } else

    // JOIN CHANNEL
    if (!oldChannel && newChannel) {
      embed.setDescription('loggers:joinVoiceChannel', { user, channel: newChannel })
      return channel.send(embed)
    } else {
    // CHANGED CHANNEL
      embed.setDescription('loggers:hasChangedVoiceChannel', { user, newChannel, oldChannel })
      return channel.send(embed)
    }
  }
}
