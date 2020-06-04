import fetch from 'node-fetch';
import { Message, TextChannel } from 'discord.js';

const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i;
const IMGFormats = ['webp', 'png', 'jpg', 'gif'];

/**
 * Checks if an URL is valid (returns a status different than 404)
 * @param url The URL to be checked
 */
const checkRequestURL = (url: string): Promise<boolean> => fetch(url)
  .then((r) => r.status !== 404)
  .catch(() => false);

/**
 * Contains various message related utility methods
 */
class MessageUtil {
  /**
   * Gets an URL from a message
   * @param message The message from which the URL will be grabbed (or a message's content)
   * @param sliceCount The amount of characters that will be sliced of a message's content
   * @returns The URL
   */
  static getContentUrl(message: Message | string, sliceCount = 0): string | null {
    const query = typeof message === 'string' ? message : message.content.slice(sliceCount);
    const resultRegex = query && REGEX_URL.exec(query);
    return resultRegex && resultRegex[0];
  }

  /**
   * Gets an image attachment from a message
   * @param message The message from which the URL will be grabbed (or a message's content)
   * @param sliceCount The amount of characters that will be sliced of a message's content
   * @returns The attachment URL
   */
  static async getImage(message: Message, sliceCount = 0): Promise<string | null> {
    const url = MessageUtil.getContentUrl(message, sliceCount);
    const resultQuery = url && await checkRequestURL(url);
    if (url && resultQuery) return url;

    const attachment = message.attachments.find(
      (a) => IMGFormats.some((format) => a.name?.endsWith(format)),
    );

    if (!attachment) return null;
    if (await checkRequestURL(attachment.url)) return null;
    return attachment.url;
  }

  /**
   * Fetches multiple images from a channel
   * @param channel The channel from which the images will be fetched
   * @param limit The limit of messages that will be fetched on the channel
   * @returns All the image URLs
   */
  static async fetchImages(channel: TextChannel, limit = 100): Promise<string[]> {
    const messages = await channel.messages.fetch({ limit });
    const images = await Promise.all(messages.map((message) => MessageUtil.getImage(message)));
    return images.filter((r) => r) as string[];
  }

  /**
   * Fetches a single image from a channel
   * @param channel The channel from which the image will be fetched
   * @param limit The limit of messages that will be fetched on the channel
   * @returns The image URL
   */
  static async fetchImage(channel: TextChannel, limit = 100): Promise<string> {
    const fetchResult = await MessageUtil.fetchImages(channel, limit);
    return fetchResult && fetchResult[0];
  }
}

export default MessageUtil;
