const { SimplicityEmbed, SimplicityListener, Constants } = require('../../../index')
const clean = (str) => str.slice(0, 1020) + (str.length >= 1024 ? '...' : str)

class MessageUpdate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (_, oldMessage, newMessage) {
    if (oldMessage.guild.me.permissions.has('READ_AUDIT_LOGS')) {
      const url = oldMessage.url
      const user = oldMessage.author
      const msgChannel = oldMessage.channel
      const oldContent = oldMessage.content
      const newContent = newMessage.content

      const embed = new SimplicityEmbed(this.getFixedT(oldMessage.guild.id))
        .setTimestamp()
        .setFooter('loggers:id', '', { id: user.id })

      // MESSAGE EDITED
      if (oldContent !== newContent) {
        embed
          .setDescription('loggers:messageEdited', { url, user, channel: msgChannel })
          .addField('loggers:before', clean(oldContent) || 'loggers:messageError', true)
          .addField('loggers:after', clean(newContent) || 'loggers:messageError', true)
          .setColor(Constants.COLORS.MESSAGE_EDIT)
        return this.sendLogMessage(oldMessage.guild.id, 'MessageEdit', embed).catch(() => null)
      } else
      // MESSAGE PINS
      if (oldMessage.pinned !== newMessage.pinned) {
        // MESSAGE PINNED
        if (!oldMessage.pinned && newMessage.pinned) {
          embed
            .setDescription('loggers:messagePinned', { url, user, channel: msgChannel })
            .setColor(Constants.COLORS.MESSAGE_PIN)
          return this.sendLogMessage(oldMessage.guild.id, 'MessagePin', embed).catch(() => null)
        } else
        // MESSAGE UNPINNED
        if (oldMessage.pinned && !newMessage.pinned) {
          embed
            .setDescription('loggers:messageUnpinned', { url, user, channel: msgChannel })
            .setColor(Constants.COLORS.MESSAGE_UNPIN)
          return this.sendLogMessage(oldMessage.guild.id, 'MessageUnpin', embed).catch(() => null)
        }
      }
    }
  }
}

module.exports = MessageUpdate
