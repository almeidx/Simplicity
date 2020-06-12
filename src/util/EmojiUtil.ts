import { TextChannel } from 'discord.js';
import { CUSTOM_EMOJIS, NORMAL_EMOJIS } from './Constants';

export type CustomEmojiTypes = keyof typeof CUSTOM_EMOJIS
export type EmojiTypes = keyof typeof NORMAL_EMOJIS
export type Emojis = CustomEmojiTypes | EmojiTypes

/**
 * Contains various emoji utility methods
 */
export default class EmojiUtil {
  static getCustomEmoji(id: CustomEmojiTypes): string {
    return CUSTOM_EMOJIS[id];
  }

  static getDefaultEmoji(name: EmojiTypes): string {
    return NORMAL_EMOJIS[name];
  }

  static getEmoji(
    opts: { id?: boolean, channel?: TextChannel },
    ...emojis: (EmojiTypes | CustomEmojiTypes)[]
  ): string {
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

    return NORMAL_EMOJIS.QUESTION;
  }
}
