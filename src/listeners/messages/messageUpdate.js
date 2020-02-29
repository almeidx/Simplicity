'use strict';

const { SimplicityEmbed, SimplicityListener } = require('@structures');
const { COLORS } = require('@util/Constants');
const { cleanString } = require('@util/Util');

class MessageUpdate extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(_, oldMessage, newMessage) {
    oldMessage = await oldMessage.fetch();
    newMessage = await newMessage.fetch();
    const url = oldMessage.url;
    const user = oldMessage.author;
    const msgChannel = oldMessage.channel;
    const oldContent = oldMessage.content;
    const newContent = newMessage.content;

    const embed = new SimplicityEmbed(this.getFixedT(oldMessage.guild.id))
      .setTimestamp()
      .setFooter('loggers:id', '', { id: user.id });

    // MESSAGE EDITED
    if (oldContent !== newContent) {
      embed
        .setDescription('loggers:messageEdited', { channel: msgChannel, url, user })
        .setColor(COLORS.MESSAGE_EDIT);
      if (oldContent) embed.addField('loggers:before', cleanString(oldContent) || 'loggers:messageError', true);
      if (newContent) embed.addField('loggers:after', cleanString(newContent) || 'loggers:messageError', true);
      return this.sendLogMessage(oldMessage.guild.id, 'MessageUpdate', embed).catch(() => null);
    } else
    // MESSAGE PINS
    if (oldMessage.pinned !== newMessage.pinned) {
      // MESSAGE PINNED
      if (!oldMessage.pinned && newMessage.pinned) {
        embed
          .setDescription('loggers:messagePinned', { channel: msgChannel, url, user })
          .setColor(COLORS.MESSAGE_PIN);
        return this.sendLogMessage(oldMessage.guild.id, 'MessageUpdate', embed).catch(() => null);
      } else
      // MESSAGE UNPINNED
      if (oldMessage.pinned && !newMessage.pinned) {
        embed
          .setDescription('loggers:messageUnpinned', { channel: msgChannel, url, user })
          .setColor(COLORS.MESSAGE_UNPIN);
        return this.sendLogMessage(oldMessage.guild.id, 'MessageUpdate', embed).catch(() => null);
      }
    }
  }
}

module.exports = MessageUpdate;
