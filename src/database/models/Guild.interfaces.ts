import { Document } from 'mongoose';

export type logTypes = 'GuildMemberAdd' | 'GuildMemberRemove' | 'GuildUpdates' | 'MessageUpdate' | 'UserUpdate' | 'VoiceChannelLogs'

export interface GuildModule {
  enable: boolean;
  channelId: string;
}

export interface GuildStarboard extends GuildModule {
  minStars: number;
}

export interface Guild extends Document {
  id: string;
  language?: string;
  prefix?: string;
  autorole: GuildModule;
  starboard: GuildStarboard;
  disableChannels: string[];
  logs: Map<logTypes, GuildModule>
}
