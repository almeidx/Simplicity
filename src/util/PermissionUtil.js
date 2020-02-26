'use strict';

/**
 * Contains various permission related utility methods.
 * @class PermissionsUtil
 */
class PermissionsUtil {
  /**
   * Creates an instance of PermissionsUtil.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Checks if a user ID is a developer.
   * @param {string} userID The user's ID.
   * @param {Client} client The Client.
   * @return {boolean} If the user is a developer.
   */
  static verifyDev(userID, client) {
    const guildClient = client.guilds.cache.get(process.env.SERVER_ID);
    const devRole = guildClient && guildClient.roles.cache.get(process.env.DEV_ROLE_ID);

    const roleCondition = devRole && devRole.members.has(userID);
    const idCondition = process.env.DEVS_IDS && process.env.DEVS_IDS.includes(userID);

    return !!(roleCondition || idCondition);
  }
}

module.exports = PermissionsUtil;
