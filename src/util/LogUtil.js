'use strict';

/**
 * Contains various log related utility methods.
 * @class LogUtil
 */
class LogUtil {
  /**
   * Creates an instance of LogUtil.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Gets a channel from the database.
   * @param {Client} client The Client.
   * @param {Guild} guild The guild.
   * @param {string} logName The name of the log.
   * @returns {Channel} The channel.
   */
  static async getChannel(client, guild, logName) {
    const guildData = client.database && await client.database.guilds.get(guild.id);
    const logData = guildData && guildData.logs && guildData.logs[logName];
    return logData && logData.channelID && guild.channels.cache.get(logData.channelID);
  }

  /**
   * Sends a message to a channel using the bot or using a webhook, if the bot has permission to create one.
   * @param {TextBasedChannel} channel The channel where the message will be sent.
   * @param {...*} body The body of the message
   * @returns {Message} The message that was sent to the channel.
   */
  static async send(channel, ...body) {
    if (!channel.permissionsFor(channel.guild.me).has('MANAGE_WEBHOOKS')) return channel.send(...body);
    else {
      const webhook = await this.getWebhook(channel);
      return webhook.send(...body);
    }
  }

  /**
   * Resolves a webhook.
   * @param {TextBasedChannel} channel The channel.
   * @returns {Webhook} The webhook that was created/found.
   */
  static async getWebhook(channel) {
    const name = `${channel.client.user.username} Logs`;
    const avatar = channel.client.user.displayAvatarURL({ dynamic: true, size: 4096 });

    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find((wk) => wk.name === name);

    if (!webhook) webhook = await channel.createWebhook(name);

    await webhook.edit({ avatar, name });
    return webhook;
  }
}

module.exports = LogUtil;
