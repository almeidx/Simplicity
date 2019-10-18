import { Document } from 'mongoose';

export default interface GuildInterface extends Document {
    guildId: string,
    prefix?: string,
    language?: string,
    disableChannels?: string[],
    disableCommands?: string[],
    moderators?: string[],
    autorole?: { roleId?: string, enable?: boolean },
    starboard?: {
      minStars?: number,
      channelId?: string,
      enable?: boolean,
    },
    logs?: {
      enable?: boolean,
      events?: Map<string, string>,
    },
    suggestionsChannel?: {
      channelId?: string,
      enable?: boolean,
      approvedEmoji?: string,
      rejectEmoji?: string,
    },
    leave?: {
      enable?: boolean,
      channelId?: string,
      message?: string,
    },
    welcome?: {
      enable?: boolean,
      channelId?: string,
      message?: string,
    },
    reactionRoles?: {
      enable?: boolean,
      emojis?: Map<string, string>,
      channels?: string[],
    },
    topicMessage?: {
      enable?: boolean,
      channelId?: string,
      message?: string,
  }
};;
