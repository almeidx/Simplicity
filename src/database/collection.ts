import Guild from './models/Guild';
import { GuildData } from './models/GuildInterface';

export function create(guildId: string, data: GuildData = {}) {
  return Guild.create({ guildId, ...data });
}

export function update(guildId: string, data: GuildData = {}) {
  return Guild.updateOne({ guildId }, data);
}

export function remove(guildId: string) {
  return Guild.deleteOne({ guildId });
}

export async function get(guildId: string) {
  const found = await Guild.findOne({ guildId });
  if (found) return found;
  return create(guildId);
}
