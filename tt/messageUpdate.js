const { Embed, LogUtils, Constants } = require('../src')
const clean = (str) => str.slice(0, 1020) + str.length >= 1024 ? '...' : str

async function messageUpdate (oldMessage, newMessage) {
  const { channel, t } = await LogUtils.getChannel(this, oldMessage.guild, 'JOIN_AND_LEAVE')

  if (channel && oldMessage.guild.me.permissions.has('READ_AUDIT_LOGS')) {
    const url = oldMessage.url
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
      embed.setDescription('loggers:messageEdited', { url, user, channel: msgChannel })
        .addField('Before', clean(oldContent) || 'errors:general', true)
        .addField('After', clean(newContent) || 'errors:general', true)
        .setColor(Constants.COLORS.MESSAGE_EDIT)
      return LogUtils.send(channel, embed)
    } else
    // MESSAGE PINS
    if (oldMessage.pinned !== newMessage.pinned) {
      // MESSAGE UNPINNED
      if (oldMessage.pinned && !newMessage.pinned) {
        embed.setDescription('loggers:messageUnpinned', { url, user, channel: msgChannel })
          .setColor(Constants.COLORS.MESSAGE_UNPIN)
        return LogUtils.send(channel, embed)
      } else
      // MESSAGE PINNED
      if (!oldMessage.pinned && newMessage.pinned) {
        embed.setDescription('loggers:messagePinned', { url, user, channel: msgChannel })
          .setColor(Constants.COLORS.MESSAGE_PIN)
        return LogUtils.send(channel, embed)
      }
    }
  }
}

module.exports = messageUpdate
