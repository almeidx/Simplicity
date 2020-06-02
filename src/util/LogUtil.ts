import {
  Client, Collection, Guild, NewsChannel, TextChannel, GuildManager,
} from 'discord.js';

type TextBasedChannel = NewsChannel | TextChannel

// temporary
interface SimplicityClient extends Client {
  database: {
    guilds: Collection<string, Guild>
  }
}

/**
 * Contains various log related utility methods.
 */
class LogUtil {
  /**
   * Gets a channel from the database.
   */
  static async getChannel(client: SimplicityClient, guild: Guild, logName: string) {
    const guildData = client.database && await client.database.guilds.get(guild.id);
    const logData = guildData && guildData.logs && guildData.logs[logName];
    return logData && logData.channelID && guild.channels.cache.get(logData.channelID);
  }

  /**
   * Sends a message to a channel using the bot or using a webhook.
   */
  static async send(channel: TextBasedChannel, ...body) {
    if (!channel.permissionsFor(channel.guild.me).has('MANAGE_WEBHOOKS')) return channel.send(...body);

    const webhook = await this.getWebhook(channel);
    return webhook.send(...body);
  }

  /**
   * Resolves a webhook.
   */
  static async getWebhook(channel: TextBasedChannel) {
    const name = `${channel.client.user.username} Logs`;
    const avatar = channel.client.user.displayAvatarURL({ dynamic: true, size: 4096 });

    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find((wk) => wk.name === name);

    if (!webhook) webhook = await channel.createWebhook(name);

    await webhook.edit({ avatar, name });
    return webhook;
  }
}

export default LogUtil;
