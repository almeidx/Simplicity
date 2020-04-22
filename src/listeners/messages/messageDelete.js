'use strict';

const { SimplicityEmbed, SimplicityListener } = require('@structures');
const { COLORS } = require('@util/Constants');
const { cleanString } = require('@util/Util');

class MessageDelete extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, message) {
    // Add deleted message for snipe command
    client.deletedMessages.set(message.channel.id, message);

    const user = message.author || client.user;

    const embed = new SimplicityEmbed(this.getFixedT(message.guild.id))
      .setTimestamp()
      .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
      .setFooter(`ID: ${user.id}`, user.displayAvatarURL({ dynamic: true }))
      .setDescription('loggers:messageDeleted', { channel: message.channel, user })
      .setColor(COLORS.MESSAGE_DELETE);

    if (message.content) {
      embed.addField(
        'loggers:content', cleanString(message.content, 0, 1024) || 'loggers:messageError',
      );
    }

    if (message.guild.me.permissions.has('VIEW_AUDIT_LOG')) {
      const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' })
        .then((audit) => audit.entries.first());
      if (entry) {
        const channelCondition = entry.extra && entry.extra.channel.id === message.channel.id;
        const userCondition = entry.target && entry.target.id === user.id;

        if (channelCondition && userCondition && entry.createdTimestamp > Date.now() - 5000) {
          const executor = entry.executor;
          if (executor) {
            embed.setDescription(
              'loggers:messageDeletedExecutor', { channel: message.channel, executor, user },
            );
          }
        }
      }
    }
    this.sendLogMessage(message.guild.id, 'MessageUpdate', embed).catch(() => null);
  }
}

module.exports = MessageDelete;
