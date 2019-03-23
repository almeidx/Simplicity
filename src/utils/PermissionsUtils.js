class PermissionsUtils {
  static verifyDev (userID, client) {
    const guildClient = client.guilds.get(process.env.SERVER_ID)
    const devRole = guildClient && guildClient.roles.get(process.env.ROLE_DEVS_ID)
    if ((devRole && !devRole.members.has(userID)) || (process.env.DEVS_IDS && !process.env.DEVS_IDS.split(', ').includes(userID))) {
      return false
    }
    return true
  }
}

module.exports = PermissionsUtils
