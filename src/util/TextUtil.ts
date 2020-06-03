import { MessageEmbed, Permissions } from 'discord.js';
import { TFunction, TOptions } from 'i18next';

type GetEmojiFunction = (e: string) => string | null

/**
 * Contains various text related utility methods.
 * @class TextUtil
 */
export default class TextUtil {
  /**
   * Resolves emotes, text and translations on strings.
   * @param {string} [text=''] The text to be resolved.
   * @param {*} [options={}] The options.
   * @returns {string} The resolved string.
  //  */
  static parse(text: string, options: {
    emoji?: GetEmojiFunction,
    t?: TFunction,
    embed?: MessageEmbed,
    tOptions?: TOptions
  } = {}): string {
    const {
      emoji, t, embed, tOptions = {},
    } = options;

    let result = text;
    if (emoji) result = TextUtil.parseEmoji(result, emoji);
    if (embed) result = TextUtil.parseEmbed(result, embed);
    if (t) result = TextUtil.parseTranslation(result, t, tOptions);

    return result;
  }

  static parseEmoji(text: string, getEmoji: GetEmojiFunction): string {
    return text.replace(/(?:#)\w+/g, (e) => getEmoji(e.slice(1).toUpperCase()) || e);
  }

  static parseEmbed(text: string, embed: MessageEmbed): string {
    return text.replace(/(?:@)\S+/g, (k) => {
      const keys = k.slice(1).split('.');
      let obj = embed;
      for (const key of keys) {
        if (!obj[key]) {
          return String(obj);
        }
        obj = obj[key];
      }
      return String(obj);
    });
  }

  static parseTranslation(text: string, t: TFunction, tOptions: TOptions): string {
    return text.replace(/\$\$\w+:\w+(?:\.?\w+?)+/gi, (s) => t(s.slice(2), tOptions));
  }

  /**
   * Parses an image from a string.
   * @param {*} text The text.
   * @param {*} imageURL The image url.
   * @param {*} permissions The permissions of the client.
   * @returns {string} The image url.
   */
  static parseImage(text: string, imageURL: string, permissions: Permissions): string {
    const arrCount: string[] = [];
    if (!imageURL) return text;
    return text.replace(/(?:\?\{image\})(\S+)/gi, (_, a) => {
      arrCount.push(a);
      if (permissions.has('ATTACH_FILES')) return '';
      return imageURL[arrCount.indexOf(a)];
    });
  }
}

module.exports = TextUtil;
