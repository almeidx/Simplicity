'use strict';

class PermissionsUtil {
  static verifyDev(userID, client) {
    const guildClient = client.guilds.cache.get(process.env.SERVER_ID);
    const devRole = guildClient && guildClient.roles.cache.get(process.env.DEV_ROLE_ID);

    const roleCondition = devRole && devRole.members.has(userID);
    const idCondition = process.env.DEVS_IDS && process.env.DEVS_IDS.includes(userID);

    return !!(roleCondition || idCondition);
  }
}

module.exports = PermissionsUtil;
