const CommandError = require('./CommandError')

class Requirements {
  constructor (requirements = {}) {
    this.argsRequired = false
    this.nsfwChannelOnly = false
    this.ownerOnly = false
    this.clientPermissions = []
    this.permissions = []
    this.responses = {
      ownerOnly: 'errors:developerOnly',
      clientPermissions: 'errors:clientMissingPermission',
      userMissingPermission: 'errors:userMissingPermission',
      argsRequired: 'errors:missingParameters',
      nsfwChannelOnly: 'errors:nsfwChannel'
    }

    for (const req in requirements) {
      let opts = requirements[req]
      if (this[req] == null) throw new Error(`${req} não existe`)
      if (typeof opts === 'object' && !Array.isArray(opts)) {
        if (opts.response) this.responses[req] = opts.response
        opts = opts.return
      }
      if ((Array.isArray(this[req]) && Array.isArray(opts)) || (typeof this[req] === typeof opts)) {
        this[req] = opts
      }
    }
  }

  handle ({ author, client, channel, guild, args, t }) {
    if (this.ownerOnly) {
      const guildClient = client.guilds.get(process.env.SERVER_ID)
      const devRole = guildClient && guildClient.roles.get(process.env.ROLE_DEVS_ID)
      if ((devRole && !devRole.members.has(author.id)) || (process.env.DEVS_IDS && !process.env.DEVS_IDS.split(', ').includes(author.id))) {
        throw new CommandError(this.responses.ownerOnly, { onUsage: true })
      }
    }

    const clientPerms = this.clientPermissions.filter((p) => !channel.permissionsFor(guild.me).has(p)).map(p => t('permissions:' + p))
    if (clientPerms.length !== 0) {
      throw new CommandError(t(this.responses.clientPermissions, { permissions: clientPerms.join(', '), count: clientPerms.length, onUsage: true }))
    }

    const memberPerms = this.permissions.filter((p) => !channel.permissionsFor(author.id).has(p)).map(p => t('permissions:' + p))
    if (memberPerms.length !== 0) {
      throw new CommandError(t(this.responses.userMissingPermission, { permissions: memberPerms.join(', '), count: memberPerms.length, onUsage: true }))
    }

    if (this.argsRequired && args.length === 0) {
      throw new CommandError(this.responses.argsRequired, { onUsage: true })
    }

    if (this.nsfwChannelOnly && !channel.nsfw) {
      throw new CommandError(this.responses.nsfwChannelOnly, { onUsage: true })
    }
  }
}

module.exports = Requirements
