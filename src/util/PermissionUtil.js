'use strict';

const { DEVELOPER_ROLE_ID, SUPPORT_GUILD } = require('@data/config');
const { getDevs } = require('@util/Util');

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
   * @returns {boolean} If the user is a developer.
   */
  static verifyDev(userID, client) {
    const guildClient = client.guilds.cache.get(SUPPORT_GUILD);
    const devRole = guildClient && guildClient.roles.cache.get(DEVELOPER_ROLE_ID);

    const roleCondition = devRole && devRole.members.has(userID);
    const devs = getDevs();
    const idCondition = devs && devs.includes(userID);

    return !!(roleCondition || idCondition);
  }
}

module.exports = PermissionsUtil;
