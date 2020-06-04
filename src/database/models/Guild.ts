/* eslint-disable max-classes-per-file */
import { Schema, model } from 'mongoose';
import { Guild, GuildModule, GuildStarboard } from './Guild.interfaces';

const GuildModuleSchema = new Schema<GuildModule>({
  enable: { type: Boolean, default: false },
  channeldId: String,
}, {
  id: false,
  timestamps: true,
});

const GuildStarboardSchema = new Schema<GuildStarboard>({
  enable: { required: true, default: false, type: Boolean },
  minStars: { required: true, default: 3, type: Number },
  channeldId: String,
}, {
  id: false,
  timestamps: true,
});

const GuildSchema = new Schema<Guild>({
  id: { required: true, type: String, unique: true },
  language: String,
  prefix: String,
  autorole: GuildModuleSchema,
  starboard: GuildStarboardSchema,
  disableChannels: { type: Array, of: String },
  logs: { type: Map, of: GuildModuleSchema },
}, {
  id: false,
  timestamps: true,
});

const guildModel = model<Guild>('guilds', GuildSchema);

export default guildModel;
