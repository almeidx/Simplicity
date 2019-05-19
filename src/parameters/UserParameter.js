const CommandError = require('../structures/command/CommandError')
const Parameter = require('../structures/Parameter')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

class UserParameter extends Parameter {
  static parseOptions (options) {
    return Object.assign({
      ...super.parseOptions(options),
      canBeAuthor: true,
      canBeBot: true,
      canBeUser: true,
      checkGlobally: true,
      checkIncludes: true
    }, options)
  }

  static parseMessageErrors (options = {}) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      canBeBot: 'errors:canBeBot',
      canBeAuthor: 'errors:canBeAuthor',
      canBeUser: 'errors:canBeUser'
    }, options.errors)
  }

  static verifyExceptions (user, exceptions = {}, { author }) {
    exceptions = this.setupOptions(exceptions)
    if (!exceptions.canBeAuthor && user.id === author.id)
      throw new CommandError(exceptions.errors.canBeAuthor, { onUsage: true })
    if (!exceptions.canBeBot && user.bot)
      throw new CommandError(exceptions.errors.canBeBot, { onUsage: true })
    if (!exceptions.canBeUser && !user.bot)
      throw new CommandError(exceptions.errors.canBeAuthor, { onUsage: true })

    return user
  }

  static async search (query, { client, guild }, options) {
    if (!query || typeof query !== 'string')
      throw new TypeError('Search string isn\'t a String')

    options = this.setupOptions(options)
    query = query.toLowerCase()
    const regexResult = MENTION_REGEX.exec(query)
    const id = regexResult && regexResult[1]

    const getID = id && client && (client.users.get(id) ||
    (guild && guild.members.get(id) && guild.members.get(id).user) ||
    (options.checkGlobally && await client.users.fetch(id).catch(() => null)))

    const find = guild && guild.members.find((m) => {
      m.user.username.toLowerCase() === query ||
      m.displayName.toLowerCase() === query ||
      m.user.username.toLowerCase().startsWith(query) ||
      m.displayName.toLowerCase().startsWith(query) ||
      m.user.username.toLowerCase().endsWith(query) ||
      m.displayName.toLowerCase().endsWith(query) ||
      (options.checkIncludes &&
      (m.user.username.toLowerCase().includes(query) ||
      m.displayName.toLowerCase().includes(query)))
    })

    return getID || (find && find.user) || null
  }
}

module.exports = UserParameter
