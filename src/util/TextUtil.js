'use strict';
/**
 * Contains various text related utility methods.
 * @class TextUtil
 */
class TextUtil {
  /**
   * Creates an instance of TextUtil.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  static get Keys() {
    return {
      EMBED: '@',
      EMOJI: '#',
      TRANSLATION: '$$',
    };
  }

  /**
   * Resolves emotes, text and translations on strings.
   * @param {string} [text=''] The text to be resolved.
   * @param {*} [options={}] The options.
   * @returns {string} The resolved string.
   */
  static parse(text = '', options = {}) {
    if (typeof text !== 'string') return text;

    const { emoji, t, embed, options: tOptions } = options;

    if (emoji) text = TextUtil.parseEmoji(text, emoji);
    if (embed) text = TextUtil.parseEmbed(text, emoji);
    if (t) text = TextUtil.parseTranslation(text, t, tOptions);

    return text;
  }

  static parseEmoji(text, getEmoji) {
    return text.replace(/(?:#)\w+/g, (e) => getEmoji(e.slice(1).toUpperCase()) || e);
  }

  static parseEmbed(text, embed) {
    return text.replace(/(?:@)\S+/g, (k) => {
      const keys = k.slice(1).split('.');
      let obj = embed;
      for (let key of keys) {
        if (!obj[key]) {
          return obj;
        }
        obj = obj[key];
      }
      return obj;
    });
  }

  static parseTranslation(text, t, tOptions) {
    return text.replace(/\$\$\w+:\w+(?:\.?\w+?)+/gi, (s) => t(s.slice(2), tOptions));
  }

  /**
   * Parses an image from a string.
   * @param {*} text The text.
   * @param {*} imageURL The image url.
   * @param {*} permissions The permissions of the client.
   * @returns {string} The image url.
   */
  static parseImage(text, imageURL, permissions) {
    const arrCount = [];
    if (!imageURL) return text;
    return text.replace(/(?:\?\{image\})(\S+)/gi, (_, a) => {
      arrCount.push(a);
      if (permissions.has('ATTACH_FILES')) return '';
      else return imageURL[arrCount.indexOf(a)];
    });
  }
}

module.exports = TextUtil;
