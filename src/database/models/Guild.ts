import { Schema, model } from 'mongoose';
import { GuildDocument } from './GuildInterface';

const GuildScherma = new Schema({
  guildId: { type: String, require: true },
  prefix: String,
  language: String,
  disableChannels: [String],
  disableCommands: [String],
  moderators: [String],
  autorole: { roleId: String, enable: Boolean },
  starboard: {
    minStars: { type: Number, default: 3 },
    channelId: String,
    enable: Boolean,
  },
  logs: {
    enable: Boolean,
    events: { type: Map, default: new Map() },
  },
  suggestionsChannel: {
    channelId: String,
    enable: Boolean,
    approvedEmoji: String,
    rejectEmoji: String,
  },
  leave: {
    enable: Boolean,
    channelId: String,
    message: String,
  },
  welcome: {
    enable: Boolean,
    channelId: String,
    message: String,
  },
  reactionRoles: {
    enable: Boolean,
    emojis: { type: Map, default: new Map() },
    channels: Array,
  },
  topicMessage: {
    enable: Boolean,
    channelId: String,
    message: String,
  },
});

export default model<GuildDocument>('Guild', GuildScherma);
