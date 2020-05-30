'use strict';

const { EMOJIS, EMOJIS_CUSTOM } = require('@util/Constants');
const { Permissions } = require('discord.js');
/**
 * Contains various emoji utility methods.
 * @class EmojiUtil
 */
class EmojiUtil {
  /**
   * Creates an instance of EmojiUtil.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated`);
  }

  static getCustomEmoji(id) {
    return EMOJIS_CUSTOM && EMOJIS_CUSTOM[id];
  }

  static getDefaultEmoji(name) {
    return EMOJIS && EMOJIS[name];
  }

  static getEmoji(...emojis) {
    let options = {};

    if (typeof emojis[emojis.length - 1] === 'object') {
      options = emojis.pop();
    }

    for (const emoji of emojis) {
      const custom = EmojiUtil.getCustomEmoji(emoji.toUpperCase());
      const { id, textChannel } = options;
      if (
        custom &&
        textChannel.guild &&
        textChannel
          .permissionsFor(textChannel.guild.me)
          .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)
      ) {
        const cachedEmoji = textChannel.client.emojis.cache.get(custom);
        if (cachedEmoji) return id ? cachedEmoji.id : cachedEmoji.toString();
      }
    }

    for (const emoji of emojis) {
      const normal = EmojiUtil.getDefaultEmoji(emoji.toUpperCase());
      if (normal) return normal;
    }

    return false;
  }
}

module.exports = EmojiUtil;
