import { Guild, GuildChannel } from 'discord.js';
import CommandError from '../../CommandError';
import Argument from './Argument';
import { ChannelArgOptions, ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';

const MENTION_REGEX = /(<#)?([0-9]{16,18})>?$/;

const searchOn = (guild: Guild, id: string | null, arg: string): GuildChannel | undefined => {
  if (id && guild.channels.cache.has(id)) guild.channels.resolve(id);
  return guild.channels
    .cache
    .find((c) => c.name.toLowerCase().includes(arg.toLowerCase()));
};

const ChannelTypes: GuildChannel['type'][] = [
  'category',
  'news',
  'store',
  'text',
  'voice',
];

export default class ChannelArgument extends Argument<GuildChannel, ChannelArgOptions> {
  parseOptions(options: ChannelArgOptions = {}): Required<ChannelArgOptions & ParameterOptions> {
    return {
      ...super.parseOptions(options),
      acceptCategory: false,
      canBeHiddenBot: false,
      canBeHiddenUser: false,
      types: ['text'],
      ...options,
    };
  }

  parse(
    opts: Required<ChannelArgOptions & ParameterOptions>,
    arg: string,
    { t, guild, member }: CommandContext,
  ): null | GuildChannel {
    if (!arg) return null;

    const regexResult = MENTION_REGEX.exec(arg);
    const id = regexResult && regexResult[2];

    const channel = searchOn(guild, id, arg);

    if (!channel) {
      throw new CommandError(t('errors:invalidChannel'));
    }

    for (const type of ChannelTypes) {
      if (!opts.types.includes(type) && channel.type === type) {
        throw new CommandError(t('errors:invalidChannel'));
      }
    }

    const hiddenChannel = channel.permissionsFor(member)?.has('VIEW_CHANNEL');
    if (!opts.canBeHiddenUser && !hiddenChannel) {
      throw new CommandError('errors:hiddenChannel', { showUsage: false });
    }

    const hiddenChannelBot = channel.permissionsFor(String(guild.me?.id))?.has('VIEW_CHANNEL');
    if (!opts.canBeHiddenBot && !hiddenChannelBot) {
      throw new CommandError('errors:hiddenChannelBot', { showUsage: false });
    }

    return channel;
  }
}
