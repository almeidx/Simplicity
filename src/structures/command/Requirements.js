const CommandError = require('./CommandError')
const PermissionsUtils = require('../../utils/PermissionsUtils')

class Requirements {
  constructor (requirements = {}, responses = {}) {
    this.argsRequired = false
    this.nsfwChannelOnly = false
    this.ownerOnly = false
    this.clientPermissions = []
    this.permissions = []
    this.guildOnly = true
    this.responses = Object.assign({
      guildOnly: 'errors:guildOnly',
      ownerOnly: 'errors:developerOnly',
      clientPermissions: 'errors:clientMissingPermission',
      userMissingPermission: 'errors:userMissingPermission',
      argsRequired: 'errors:missingParameters',
      nsfwChannelOnly: 'errors:nsfwChannel'
    }, responses)

    for (const req in requirements) {
      let opts = requirements[req]
      if (this[req] == null) throw new Error(`${req} doesn't exist`)
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
    if (this.ownerOnly && !PermissionsUtils.verifyDev(author.id, client)) {
      throw new CommandError(this.responses.ownerOnly)
    }

    if (this.guildOnly && !guild) {
      throw new CommandError(this.responses.guildOnly)
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
