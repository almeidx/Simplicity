import { GuildChannel } from 'discord.js';
import CommandContext from '../CommandContext';

export type ArgumentFunc = (ctx: CommandContext, wordInvalid: string) => Promise<string> | string;

export interface FlagOptions {
  aliases: string[];
  whitelist: string[];
  name: string;
}

export interface ArgumentOptions {
  entireQuery: boolean;
  matchJoin: string;
  missingError: string | ArgumentFunc;
  optional: boolean;
  showUsage: boolean;
}

export interface DefaultFlagOptions extends FlagOptions {
  isDefaultFlag: true,
  handle: (ctx: CommandContext) => any;
}

export interface BooleanArgOptions {
  falseValues: string[]
  trueValues: string[];
}

export interface ChannelArgOptions {
  acceptCategory: boolean;
  canBeHiddenBot: boolean;
  canBeHiddenUser: boolean;
  types: GuildChannel['type'][],
}

export interface EmojiArgOptions {
  sameGuildOnly: boolean;
}

export interface UserArgOptions {
  acceptBot: boolean;
  acceptDeveloper: boolean;
  acceptSelf: boolean;
  acceptUser: boolean;
  fetchGlobal: boolean;
}

export interface StringArgOptions {
  cleanContent: boolean;
  errorRegex?: RegExp | null;
  missingRegex?: string | null;
  maxLength: number;
  truncate: boolean;
}

export type ParameterOptions = ArgumentOptions & FlagOptions;
export type ParameterOptionsTypes = ParameterOptions
  & BooleanArgOptions
  & ChannelArgOptions
  & EmojiArgOptions

export type ArgumentTypes = 'boolean' | 'emoji' | 'user' | 'string';
export type FlagTypes = 'booleanFlag' | ArgumentTypes;
export type ParameterTypes = FlagTypes | ArgumentTypes
