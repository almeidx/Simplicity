import { GuildEmoji } from 'discord.js';
import CommandError from '../../CommandError';
import Argument from './Argument';
import { EmojiArgOptions, ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';

const EMOJI_REGEX = /^<(a)?:(\w+):(\d{16,18})>$/;

export default class EmojiArgument extends Argument<GuildEmoji, EmojiArgOptions> {
  parseOptions(
    options: Partial<EmojiArgOptions> = {},
  ):Required<EmojiArgOptions & ParameterOptions> {
    return {
      ...super.parseOptions(options),
      sameGuildOnly: false,
      ...options,
    };
  }

  parse(
    opts: Required<EmojiArgOptions & ParameterOptions>,
    arg: string, { t, client, guild }: CommandContext,
  ): GuildEmoji {
    const regexResult = EMOJI_REGEX.exec(arg);
    if (regexResult) {
      const [,,, id] = regexResult;
      const emoji = client.emojis.cache.get(id);
      if (!emoji) {
        throw new CommandError(t('errors:invalidEmoji'), { showUsage: opts.showUsage });
      }
      if (opts.sameGuildOnly && emoji.guild.id !== guild.id) {
        throw new CommandError(t('errors:emojiNotFromSameGuild'));
      }
      return emoji;
    }

    const emoji = (opts.sameGuildOnly ? guild : client).emojis.cache.find((e) => e.name === arg);
    if (!emoji) throw new CommandError(t('errors:invalidEmoji'), { showUsage: opts.showUsage });
    return emoji;
  }
}
