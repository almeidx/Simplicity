'use strict';

const i18next = require('i18next');

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

  /**
   * Resolves emotes, text and translations on strings.
   * @param {string} [text=''] The text to be resolved.
   * @param {*} [options={}] The options.
   * @returns {string} The resolved string.
   */
  static parse(text = '', options = {}) {
    if (typeof text !== 'string') return text;

    const { emoji, t, embed } = Object.assign({ embed: null, emoji: null, options: {}, t: null }, options);
    // Add Emojis in #...
    if (emoji) text = text.replace(/(?:#)\w+/g, (e) => emoji(e.slice(1).toUpperCase()) || e);

    // Add text embed in @...
    if (embed) {
      text = text.replace(/(?:@)\S+/g, (k) => {
        const [key, v1, v2] = k.slice(1).split('.');
        const result = key && embed[key];
        const result1 = v1 && result && result[v1];
        const result2 = v2 && result1 && result1[v2];
        return result2 || result1 || result || k;
      });
    }

    // Add translation in $"..."
    if (t) {
      text = text.replace(/(?:\$\$)(\S+)/g, (s) => this.t(t, s.slice(2), options.options));
      return this.t(t, text, options.options);
    }
    return text;
  }

  /**
   * Resolves a translation.
   * @param {*} t The i18next object.
   * @param {string} [key=''] The key of said translation.
   * @param {*} [options={}] The options.
   * @returns {string} The finalized translation.
   */
  static t(t, key = '', options = {}) {
    if (!i18next.exists(key) || !t) return key;
    else if (t) return t(key, options);
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
