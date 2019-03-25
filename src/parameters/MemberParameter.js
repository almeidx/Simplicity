const UserParameter = require('./UserParameter')
const CommandError = require('../structures/command/CommandError')

class MemberParameter extends UserParameter {
  static parseOptions (options) {
    return Object.assign({
      ...super.parseOptions(options),
      botRoleHighest: true,
      userRoleHighest: true
    }, options)
  }

  static parseMessageErrors (options) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      botRoleHighest: 'errors:clientMissingRole',
      userRoleHighest: 'errors:userMissingRole'
    }, options.errors)
  }

  static async verifyExceptions (member, { guild, memberAuthor, commandName }, options = {}) {
    options = this.setupOptions(options)

    await super.verifyExceptions(member.user, { author: memberAuthor.user }, options)
    if (this.userRoleHighest && member.roles.highest.position >= memberAuthor.roles.highest.position) throw new CommandError(this.errors.userRoleHighest, { commandName })
    if (this.botRoleHighest && guild.me.roles.highest.position <= member.roles.highest.position) throw new CommandError(this.errors.botRoleHighest, { commandName })

    return member
  }

  static async search (query, { guild, client }, options = {}) {
    options = this.setupOptions(options)
    const user = await super.search(query, { guild, client }, options)

    return (user && guild.member(user)) || null
  }
}

module.exports = MemberParameter
