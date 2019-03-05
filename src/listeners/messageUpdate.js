const { Embed, LogUtils, Constants } = require('../')
async function messageUpdate (oldMessage, newMessage) {
  const { channel, t } = await LogUtils.getChannel(this, oldMessage.guild, 'JOIN_AND_LEAVE')

  if (channel && oldMessage.guild.me.permissions.has('READ_AUDIT_LOGS')) {
    const user = oldMessage.author
    const msgChannel = oldMessage.channel
    const oldContent = oldMessage.content
    const newContent = newMessage.content
    const embed = new Embed({ t })
      .setTimestamp()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setFooter(`ID: ${user.id}`)

    // MESSAGE EDITED
    if (oldContent !== newContent) {
      embed.setDescription('loggers:messageEdited', { user, channel: msgChannel })
        .addField('Before', (oldContent.slice(0, 1020) + oldContent.length >= 1024 ? '...' : oldContent) || 'errors:general', true)
        .addField('After', (newContent.slice(0, 1020) + newContent.length >= 1024 ? '...' : newContent) || 'errors:general', true)
        .setColor(Constants.COLORS.MESSAGE_EDIT)
      return LogUtils.send(embed)
    } else
    // MESSAGE PINS
    if (oldMessage.pinned !== newMessage.pinned) {
      // MESSAGE UNPINNED
      if (oldMessage.pinned && !newMessage.pinned) {
        embed.setDescription('loggers:messageUnpinned', { user, channel: msgChannel })
          .setColor(Constants.COLORS.MESSAGE_UNPIN)
        return LogUtils.send(embed)
      } else
      // MESSAGE PINNED
      if (!oldMessage.pinned && newMessage.pinned) {
        embed.setDescription('loggers:messagePinned', { user, channel: msgChannel })
          .setColor(Constants.COLORS.MESSAGE_PIN)
        return LogUtils.send(embed)
      }
    }
  }
}

module.exports = messageUpdate
