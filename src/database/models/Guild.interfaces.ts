import { Document } from 'mongoose';

export type logTypes =
  'GuildMemberAdd' | 'GuildMemberRemove' | 'GuildUpdates' | 'MessageUpdate' | 'UserUpdate' | 'VoiceChannelLogs'

export interface GuildModule {
  enable: boolean;
  channelId: string;
}

export interface GuildStarboard extends GuildModule {
  minStars: number;
}

export interface GuildDoc extends Document {
  id: string;
  language?: string;
  prefix?: string;
  autorole: GuildModule;
  starboard: GuildStarboard;
  disabledChannels: string[];
  logs: Map<logTypes, GuildModule>;
}
