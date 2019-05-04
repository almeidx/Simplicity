const { SimplicityEmbed, SimplicityListener, Utils } = require('../../../index')

class ChannelCreate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (_, channel) {
    const guild = channel.guild
    if (!guild) return

    const embed = new SimplicityEmbed(this.getFixedT(guild.id))
      .setTimestamp()
      .setAuthor(guild.name, Utils.getServerIconURL(guild))
      .setFooter('loggers:channelId', '', { id: channel.id })
      .setDescription('loggers:channelCreated', { type: channel.type, name: channel.name })

    if (guild.me.permissions.has('VIEW_AUDIT_LOG')) {
      const entry = await guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(audit => audit.entries.first())
      if (entry && (entry.target && entry.target.id === channel.id) && entry.createdTimestamp > Date.now() - 5000) {
        const executor = entry.executor
        if (executor)
          embed.setDescription('loggers:channelCreatedExecutor', { type: channel.type, name: channel.name, executor })
      }
    }

    this.sendLogMessage(guild.id, 'ChannelUpdate', embed).catch(() => null)
  }
}

module.exports = ChannelCreate
