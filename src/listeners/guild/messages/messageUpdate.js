const { Constants, SimplicityEmbed, SimplicityListener, Utils } = require('../../../index')
const { cleanString } = Utils

class MessageUpdate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (_, oldMessage, newMessage) {
    oldMessage = await oldMessage.fetch()
    newMessage = await newMessage.fetch()
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
        .setColor(Constants.COLORS.MESSAGE_EDIT)
      if (oldContent)
        embed.addField('loggers:before', cleanString(oldContent) || 'loggers:messageError', true)
      if (newContent)
        embed.addField('loggers:after', cleanString(newContent) || 'loggers:messageError', true)
      return this.sendLogMessage(oldMessage.guild.id, 'MessageUpdate', embed).catch(() => null)
    } else
    // MESSAGE PINS
    if (oldMessage.pinned !== newMessage.pinned)
      // MESSAGE PINNED
      if (!oldMessage.pinned && newMessage.pinned) {
        embed
          .setDescription('loggers:messagePinned', { url, user, channel: msgChannel })
          .setColor(Constants.COLORS.MESSAGE_PIN)
        return this.sendLogMessage(oldMessage.guild.id, 'MessageUpdate', embed).catch(() => null)
      } else
      // MESSAGE UNPINNED
      if (oldMessage.pinned && !newMessage.pinned) {
        embed
          .setDescription('loggers:messageUnpinned', { url, user, channel: msgChannel })
          .setColor(Constants.COLORS.MESSAGE_UNPIN)
        return this.sendLogMessage(oldMessage.guild.id, 'MessageUpdate', embed).catch(() => null)
      }
  }
}

module.exports = MessageUpdate
