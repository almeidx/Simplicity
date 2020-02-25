'use strict';

class LogUtil {
  static async getChannel(client, guild, logName) {
    const guildData = client.database && await client.database.guilds.get(guild.id);
    const logData = guildData && guildData.logs && guildData.logs[logName];
    return logData && logData.channelID && guild.channels.cache.get(logData.channelID);
  }

  static async send(channel, ...body) {
    if (!channel.permissionsFor(channel.guild.me).has('MANAGE_WEBHOOKS')) return channel.send(...body);
    else {
      const webhook = await this.getWebhook(channel);
      return webhook.send(...body);
    }
  }

  static async getWebhook(channel) {
    const name = `${channel.client.user.username} Logs`;
    const avatar = channel.client.user.displayAvatarURL();

    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find((wk) => wk.name === name);

    if (!webhook) webhook = await channel.createWebhook(name);

    await webhook.edit({ name, avatar });
    return webhook;
  }
}

module.exports = LogUtil;
