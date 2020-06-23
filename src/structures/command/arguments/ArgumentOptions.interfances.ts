import { GuildChannel } from 'discord.js';
import CommandContext from '../CommandContext';
import Argument from './types/Argument';

export type ArgumentFunc = (ctx: CommandContext, wordInvalid: string) => Promise<string> | string;

export interface FlagOptions {
  aliases?: string[];
  whitelist?: string[];
  name: string;
}

export interface ArgumentOptions {
  entireQuery?: boolean;
  matchJoin?: string;
  missingError?: string | ArgumentFunc;
  optional?: boolean;
  showUsage?: boolean;
}

export interface DefaultFlagOptions extends FlagOptions {
  isDefaultFlag: true,
  handle: (ctx: CommandContext) => any;
}

export interface BooleanArgOptions {
  falseValues?: string[]
  trueValues?: string[];
}

export interface ChannelArgOptions {
  acceptCategory?: boolean;
  canBeHiddenBot?: boolean;
  canBeHiddenUser?: boolean;
  types?: GuildChannel['type'][],
}

export interface EmojiArgOptions {
  sameGuildOnly?: boolean;
}

export interface UserArgOptions {
  acceptBot?: boolean;
  acceptDeveloper?: boolean;
  acceptSelf?: boolean;
  acceptUser?: boolean;
  fetchGlobal?: boolean;
}

export interface StringArgOptions {
  cleanContent?: boolean;
  errorRegex?: RegExp | null;
  missingRegex?: string | null;
  maxLength?: number;
  truncate?: boolean;
}

export interface RoleArgOptions {
  acceptEveryone?: boolean;
  authorNeedsHigherRole?: boolean;
  botNeedsHigherRole?: boolean;
}

export type ParameterOptions = ArgumentOptions & FlagOptions;

export interface BoolOpts extends BooleanArgOptions {
  type: 'boolean';
}

export interface UserOpts extends UserArgOptions {
  type: 'user';
}

export interface EmojiOpts extends EmojiArgOptions {
  type: 'emoji'
}

export interface StringOpts extends StringArgOptions {
  type: 'string';
}

export interface BooleanFlagOpts {
  type: 'booleanFlag';
}

export interface RoleOpts extends RoleArgOptions {
  type: 'role'
}

export type ParameterOptionsTypes = BooleanArgOptions
  & ChannelArgOptions
  & EmojiArgOptions
  & StringArgOptions

export type ParameterOpts = BoolOpts | UserOpts | EmojiOpts | StringOpts | BooleanFlagOpts | RoleOpts;
export type ParameterTypes = ParameterOpts['type'];

export type ParameterOptsTypes = ((ParameterOpts
  | (ParameterOptionsTypes & { type: ParameterTypes[] }))
  & ArgumentOptions)

export type CommandParameter =
  ParameterOptsTypes &
  Required<FlagOptions> &
  Required<ArgumentOptions> &
  DefaultFlagOptions &
  { parameters: Argument<any, any>[] };
