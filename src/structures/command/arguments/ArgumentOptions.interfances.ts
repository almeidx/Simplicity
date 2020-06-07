import { Context } from 'vm';
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
  handle: (ctx: Context) => any;
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

export interface UserArgOptions {
  acceptBot?: boolean;
  acceptDeveloper?: boolean;
  acceptSelf?: boolean;
  acceptUser?: boolean;
  fetchGlobal?: boolean;
}

export type ParameterOptions = ArgumentOptions & FlagOptions;
export type ParameterOptionsTypes = ParameterOptions & BooleanArgOptions
export type ArgumentTypes = 'boolean';
export type FlagTypes = 'booleanFlag' | ArgumentTypes;
export type ParameterTypes = FlagTypes | ArgumentTypes
