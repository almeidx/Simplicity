import { TextChannel } from 'discord.js';
import Constants from './Constants';

type CustomEmojiTypes = keyof typeof Constants.EMOJIS_CUSTOM
type EmojiTypes = keyof typeof Constants.EMOJIS

/**
 * Contains various emoji utility methods.
 * @class EmojiUtil
 */
class EmojiUtil {
  static getCustomEmoji(id: CustomEmojiTypes) {
    return Constants.EMOJIS_CUSTOM[id];
  }

  static getDefaultEmoji(name: EmojiTypes) {
    return Constants.EMOJIS[name];
  }

  static getEmoji(
    opts: { id?: boolean, channel?: TextChannel },
    ...emojis: (EmojiTypes | CustomEmojiTypes)[]
  ) {
    for (const emoji of emojis) {
      const custom = EmojiUtil.getCustomEmoji(emoji as CustomEmojiTypes);
      const { id, channel } = opts;
      const client = channel?.guild.me;
      if (
        client
        && custom
        && channel?.permissionsFor(client)?.has('USE_EXTERNAL_EMOJIS')
      ) {
        const cachedEmoji = channel.client.emojis.cache.get(custom);
        if (cachedEmoji) return id ? cachedEmoji.id : cachedEmoji.toString();
      }
    }

    for (const emoji of emojis) {
      const normal = EmojiUtil.getDefaultEmoji(emoji as EmojiTypes);
      if (normal) return normal;
    }

    return false;
  }
}

module.exports = EmojiUtil;
