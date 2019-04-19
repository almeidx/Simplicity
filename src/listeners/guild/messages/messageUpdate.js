const { SimplicityEmbed, Listener, Constants } = require('../../../index')
const clean = (str) => str.slice(0, 1020) + str.length >= 1024 ? '...' : str

class MessageUpdate extends Listener {
  constructor (client) {
    super(client)
  }

  on (client, oldMessage, newMessage, t) {
    if (oldMessage.guild.me.permissions.has('READ_AUDIT_LOGS')) {
      const url = oldMessage.url
      const user = oldMessage.author
      const msgChannel = oldMessage.channel
      const oldContent = oldMessage.content
      const newContent = newMessage.content

      const embed = new SimplicityEmbed({ user, t }, { autoFooter: false })
        .setTimestamp()
        .setFooter(`ID: ${user.id}`)

      // MESSAGE EDITED
      if (oldContent !== newContent) {
        embed.setDescription('loggers:messageEdited', { url, user, channel: msgChannel })
          .addField('loggers:before', clean(oldContent) || 'errors:general', true)
          .addField('loggers:after', clean(newContent) || 'errors:general', true)
          .setColor(Constants.COLORS.MESSAGE_EDIT)
        return this.sendMessage('messageEdit', embed).catch(() => null)
      } else

      // MESSAGE PINS
      if (oldMessage.pinned !== newMessage.pinned) {
        // MESSAGE UNPINNED
        if (oldMessage.pinned && !newMessage.pinned) {
          embed.setDescription('loggers:messageUnpinned', { url, user, channel: msgChannel })
            .setColor(Constants.COLORS.MESSAGE_UNPIN)
          return this.sendMessage('messageUnpin', embed).catch(() => null)
        } else
        // MESSAGE PINNED
        if (!oldMessage.pinned && newMessage.pinned) {
          embed.setDescription('loggers:messagePinned', { url, user, channel: msgChannel })
            .setColor(Constants.COLORS.MESSAGE_PIN)
          return this.sendMessage('messagePin', embed).catch(() => null)
        }
      }
    }
  }
}

module.exports = MessageUpdate
