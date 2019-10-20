import { PermissionString, User, TextChannel } from 'discord.js';
import SimplicityClient from '../../../client/SimplicityClient';

export function isDeveloper(userID: string, client: SimplicityClient) {
  const guildClient = process.env.SERVER_ID && client.guilds.get(process.env.SERVER_ID);
  const devRole = guildClient && guildClient.roles.get(process.env.DEV_ROLE_ID);

  const roleCondition = devRole && devRole.members.has(userID);
  const idCondition = process.env.DEVS_IDS && process.env.DEVS_IDS.includes(userID);

  return !!(roleCondition || idCondition);
}

export function notHavePermissions(
  permissions: PermissionString[], channel: TextChannel, user: User,
) {
  return permissions.filter((perm) => !channel.permissionsFor(user).has(perm, true));
}
