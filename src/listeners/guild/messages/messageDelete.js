const { Constants, SimplicityListener, SimplicityEmbed } = require('../../../index')
const clean = (str) => str.slice(0, 1020) + str.length >= 1024 ? '...' : str

class MessageDelete extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (_, message) {
    const user = message.author

    const embed = new SimplicityEmbed(this.getFixedT(message.guild.id))
      .setTimestamp()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setFooter(`ID: ${user.id}`, user.displayAvatarURL())
      .setDescription('loggers:messageDeleted', { user, channel: message.channel })
      .setColor(Constants.COLORS.MESSAGE_DELETE)

    if (message.content) embed.addField('loggers:content', clean(message.content) || 'loggers:messageError')

    if (message.guild.me.permissions.has('VIEW_AUDIT_LOG')) {
      const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first())
      if (entry) {
        const channelCondition = entry.extra && entry.extra.channel.id === message.channel.id
        const userCondition = entry.target && entry.targe.id === user.id

        if (channelCondition && userCondition && entry.createdTimestamp > Date.now() - 5000) {
          const executor = entry.executor
          if (executor) embed.setDescription('loggers:messageDeletedExecutor', { user, channel: message.channel, executor })
        }
      }
    }
    this.sendLogMessage(message.guild.id, 'MessageDelete', embed).catch(() => null)
  }
}

module.exports = MessageDelete
