'use strict';

const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i;
const IMGFormats = ['webp', 'png', 'jpg', 'gif'];
const fetch = require('node-fetch');

/**
 * Checks if an URL is valid (returns a status different than 404).
 * @param {string} url The URL to be checked.
 * @returns {boolean} If the URL returns a status different than 404.
 * @private
 */
const checkRequestURL = (url) => fetch(url).then((r) => r.status !== 404).catch(() => null);

/**
 * Contains various message related utility methods.
 * @class MessageUtil
 */
class MessageUtil {
  /**
   * Creates an instance of MessageUtil.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Gets an URL from a message.
   * @param {Message|string} message The message from which the URL will be grabbed (or a message's content).
   * @param {number} [sliceCount=0] The amount of characters that will be sliced of a message's content.
   * @returns {string} The URL.
   */
  static getContentUrl(message, sliceCount = 0) {
    const query = typeof message === 'string' ? message : message.content ? message.content.slice(sliceCount) : null;
    const resultRegex = query && REGEX_URL.exec(query);
    return resultRegex && resultRegex[0];
  }

  /**
   * Gets an image attachment from a message.
   * @param {Message} message The message from which the URL will be grabbed (or a message's content).
   * @param {number} [sliceCount=0] The amount of characters that will be sliced of a message's content.
   * @returns {string} The attachment URL.
   */
  static async getImage(message, sliceCount = 0) {
    const url = this.getContentUrl(message, sliceCount);
    const resultQuery = await checkRequestURL(url);
    if (resultQuery) return url;

    const attachments = message && message.attachments;
    const attachment = attachments && attachments.find((a) => IMGFormats.some((format) => a.name.endsWith(format)));
    return attachment && await checkRequestURL(attachment.url) && attachment.url;
  }

  /**
   * Fetches multiple images from a channel.
   * @param {*} channel The channel from which the images will be fetched.
   * @param {number} [limit=100] The limit of messages that will be fetched on the channel.
   * @returns {Array<string>} All the image URLs.
   * @private
   */
  static async fetchImages(channel, limit = 100) {
    const messages = await channel.messages.fetch(limit).catch(() => null);
    return messages && (await Promise.all(messages.map((message) => this.getImage(message)))).filter((r) => r);
  }

  /**
   * Fetches a single image from a channel.
   * @param {*} channel The channel from which the image will be fetched.
   * @param {number} [limit=100] The limit of messages that will be fetched on the channel.
   * @returns {string} The image URL.
   */
  static async fetchImage(channel, limit = 100) {
    const fetchResult = await this.fetchImages(channel, limit);
    return fetchResult && fetchResult[0];
  }
}

module.exports = MessageUtil;
