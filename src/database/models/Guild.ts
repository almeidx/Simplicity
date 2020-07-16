/* eslint-disable max-classes-per-file */
import { Schema, model } from 'mongoose';
import { GuildModule, GuildStarboard, GuildDoc } from './Guild.interfaces';

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

const GuildSchema = new Schema<GuildDoc>({
  id: { required: true, type: String, unique: true },
  language: String,
  prefix: String,
  autorole: GuildModuleSchema,
  starboard: GuildStarboardSchema,
  disabledChannels: { type: Array, of: String },
  logs: { type: Map, of: GuildModuleSchema },
}, {
  id: false,
  timestamps: true,
});

export default model<GuildDoc>('guilds', GuildSchema);
