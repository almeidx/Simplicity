class LogUtils {
  static async getChannel (client, guild, logName) {
    const guildData = await client.database.guilds.get(guild.id)
    const logData = guildData && guildData.logs && guildData.logs.find(e => e.logName === logName)
    const channel = logData && logData.channelID && guild.channels.get(logData.channelID)
    const t = channel && guildData && client.i18next.getFixedT(guildData.lang || process.env.DEFAULT_LANG)
    return { channel, t }
  }

  static async send (channel, ...body) {
    if (!channel.permissionsFor(channel.guild.me).has('MANAGE_WEBHOOKS')) {
      return channel.send(...body)
    } else {
      const { client } = channel
      const name = client.user.username + ' Logs'
      const webhook = await channel.createWebhook(name, { avatar: client.user.displayAvatarURL() })
      await webhook.send(...body)
      await webhook.delete()
    }
  }
}

module.exports = LogUtils
