class PermissionsUtils {
  static verifyDev (userID, client) {
    const guildClient = client.guilds.get(process.env.SERVER_ID)
    const devRole = guildClient && guildClient.roles.get(process.env.DEV_ROLE_ID)
    const roleCondition = devRole && !devRole.members.has(userID)
    const idCondition = process.env.DEVS_IDS && !process.env.DEVS_IDS.includes(userID)
    if (roleCondition || idCondition) return false
    else return true
  }
}

module.exports = PermissionsUtils
