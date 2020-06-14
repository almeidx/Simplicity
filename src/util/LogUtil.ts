/* eslint-disable consistent-return */
import {
  MessageAdditions, MessageOptions, NewsChannel, TextChannel,
  StringResolvable, Message, Webhook, Guild,
} from 'discord.js';
import SimplicityClient from '../structures/discord/SimplicityClient';
import { logTypes } from '../database';

type TextBasedChannel = NewsChannel | TextChannel;
type ContentResolvable = StringResolvable | MessageOptions | MessageAdditions;

/**
 * Contains various log related utility methods.
 */
export default class LogUtil {
  /**
   * Gets a channel from the database
   * @param client The Client
   * @param guild The guild
   * @param logName The name of the log
   * @returns The channel
   */
  static async getChannel(
    client: SimplicityClient, guild: Guild, log: logTypes,
  ): Promise<TextChannel|void> {
    if (!client.database) return;

    const guildData = await client.database.guilds.findById(guild.id);
    if (!guildData) return;

    const logData = guildData.logs.get(log);
    if (!logData || !logData.channelId) return;

    const logChannel = guild.channels.cache.get(logData.channelId);
    if (logChannel instanceof TextChannel) return logChannel;
  }

  /**
   * Sends a message to a channel using the bot or using a webhook
   * @param channel The channel where the message will be sent
   * @param body The body of the message
   * @returns The message that was sent to the channel
   */
  static async send(channel: TextBasedChannel, body: ContentResolvable): Promise<Message> {
    const me = channel.guild?.me;
    const permissions = me && channel.permissionsFor(me);
    if (permissions && !permissions.has('MANAGE_WEBHOOKS')) return channel.send(body);

    const webhook = await LogUtil.getWebhook(channel);
    return webhook.send(body);
  }

  /**
   * Resolves a webhook
   * @param channel The channel
   * @returns The webhook that was created/found
   */
  static async getWebhook(channel: TextBasedChannel): Promise<Webhook> {
    const name = `${channel.client.user?.username ?? 'Bot'} Logs` || 'Logs';
    const avatar = channel.client.user?.displayAvatarURL({ dynamic: true, size: 4096 });

    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find((wk) => wk.name === name);

    if (!webhook) webhook = await channel.createWebhook(name);

    await webhook.edit({ avatar, name });
    return webhook;
  }
}
