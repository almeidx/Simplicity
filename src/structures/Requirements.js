const CommandError = require('./CommandError')
class Requirements {
  constructor (requirements = {}) {
    this.argsRequired = false
    this.ownerOnly = false
    this.clientPermissions = []
    this.permissions = []
    this.responses = {
      ownerOnly: 'erros:developerOnly',
      clientPermissions: 'erros:clientMissingPermission',
      argsRequired: 'args'
    }

    for (const req in requirements) {
      let opts = requirements[req]
      if (this[req] == null) throw new Error(`${req} não existe`)
      if (typeof opts === 'object') {
        if (opts.response) this.responses[req] = opts.response
        opts = opts.return
      }
      if ((Array.isArray(this[req]) && Array.isArray(opts)) || (typeof this[req] === typeof opts)) {
        this[req] = opts
      }
    }
  }

  handle ({ author, client, channel, guild, args }) {
    if (this.ownerOnly) {
      const guildClient = client.guilds.get(process.env.SERVER_ID)
      const devRole = guildClient && guildClient.roles.get(process.env.ROLE_DEVS_ID)
      if ((devRole && !devRole.members.has(author.id)) || (process.env.DEVS_ID && !process.env.DEV_IDS.split(',').includes(author.id))) {
        return new CommandError(this.responses.ownerOnly)
      }
    }

    const clientPerms = this.clientPermissions.filter((p) => !channel.permissionsFor(guild.me).has(p))
    if (clientPerms.length !== 0) {
      return new CommandError(this.responses.clientPermissions, { perm: clientPerms[0] })
    }

    const memberPerms = this.permissions.filter((p) => !channel.permissionsFor(author.id).has(p))
    if (memberPerms.length !== 0) {
      return new CommandError(this.responses.permissions, { perm: memberPerms[0] })
    }

    if (this.argsRequired && args.length === 0) {
      return new CommandError(this.responses.argsRequired)
    }
  }
}

module.exports = Requirements
