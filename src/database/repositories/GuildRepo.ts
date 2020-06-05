/* eslint-disable import/prefer-default-export */
import { guilds, GuildDoc } from '..';

export const findGuild = async (guildId: string): Promise<GuildDoc> => {
  const guild = await guilds.findOne({ id: guildId });
  if (guild) return guild;
  return guilds.create({ id: guildId });
};
