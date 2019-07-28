'use strict';

const i18next = require('i18next');

class TextUtils {
  static parse(text = '', options = {}) {
    if (typeof text !== 'string') return text;

    const { emoji, t, embed } = Object.assign({ emoji: null, t: null, embed: null, options: {} }, options);
    // Add Emojis in #...
    if (emoji) text = text.replace(/(?:#)\w+/g, (e) => emoji(e.slice(1).toUpperCase()) || e);

    // Add text embed in @...
    if (embed) text = text.replace(/(?:@)\S+/g, (k) => {
      const [key, v1, v2] = k.slice(1).split('.');
      const result = key && embed[key];
      const result1 = v1 && result && result[v1];
      const result2 = v2 && result1 && result1[v2];
      return result2 || result1 || result || k;
    });

    // Add translation in $"..."
    if (t) {
      text = text.replace(/(?:\$\$)(\S+)/g, (s) => this.t(t, s.slice(2), options.options));
      return this.t(t, text, options.options);
    }
    return text;
  }

  static t(t, key = '', options = {}) {
    if (!i18next.exists(key) || !t) return key;
    else if (t) return t(key, options);
  }

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

module.exports = TextUtils;
