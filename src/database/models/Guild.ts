/* eslint-disable max-classes-per-file */
import { Schema, model } from 'mongoose';
import {
  Guild, GuildModule, GuildStarboard, GuildModel,
} from './Guild.interfaces';

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

GuildSchema.method('get', async function get(this: Guild, guildId: string): Promise<Guild> {
  const guildModel = this.model<Guild>('guilds');
  const find = await guildModel.findOne({ id: guildId });
  if (find) return find;
  return guildModel.create({ id: guildId });
});

const guildModel = model<Guild, GuildModel>('guilds', GuildSchema);

export default guildModel;
