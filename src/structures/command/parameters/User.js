const Parameter = require('./Parameter')
const CommandError = require('../CommandError')
const REGEX_ID = /[0-9]{16,18}/g
class User extends Parameter {
  constructor (options = {}) {
    super(options)

    options = Object.assign({
      acceptBot: true,
      acceptUser: true,
      acceptSelf: true,
      checkID: true,
      checkNick: true,
      checkUsername: true,
      useLowerCase: true,
      useStartsWith: true,
      checkUserGlobal: false
    }, options)

    this.acceptSelf = !!options.self
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser

    this.checkUserGlobal = !!options.checkUserGlobal
    this.checkNick = !!options.checkNick
    this.checkUsername = !!options.checkUsername
    this.checkID = !!options.checkID

    this.useStartsWith = !!options.useStartsWith
    this.useLowerCase = !!options.useLowerCase

    this.errors = Object.assign({
      acceptBot: 'errors:acceptBot',
      acceptUser: 'errors:acceptUser',
      acceptSelf: 'errors:acceptSelf'
    }, options.errors)
  }

  async handle (context, args) {
    const str = args.join(' ')
    const user = args.length > 0 && await this.getUser(context, str)
    if (!user) return null

    if (!this.acceptSelf && user.id === context.author.id) throw new CommandError(this.errors.acceptSelf, { onUsage: true })
    if (!this.acceptBot && user.bot) throw new CommandError(this.errors.acceptBot, { onUsage: true })
    if (!this.acceptUser && !user.bot) throw new CommandError(this.errors.acceptSelf, { onUsage: true })

    return user
  }

  async getUser ({ client, guild }, str) {
    const { users } = client

    const resultRegex = this.checkID && REGEX_ID.exec(str)
    const userRegex = resultRegex && users.get(resultRegex[0])
    if (userRegex) return userRegex

    if (guild) {
      const userUsername = this.checkUsername && guild.members.find(m => m.user.username === str)
      if (userUsername) return userUsername.user

      const userUsernameLowercase = this.checkUsername && this.useLowerCase && guild.members.find(m => m.user.username.toLowerCase() === str.toLowerCase())
      if (userUsernameLowercase) return userUsernameLowercase.user

      const userNick = this.checkNick && guild.members.find(m => m.nickname && (m.nickname === str))
      if (userNick) return userNick

      const userNickLowercase = this.checkNick && this.useLowerCase && guild.members.find(m => m.nickname && (m.nickname.toLowerCase() === str.toLowerCase()))
      if (userNickLowercase) return userNickLowercase.user

      const userUsernameStartsWith = this.useStartsWith && this.checkUsername && guild.members.find(m => m.user.username.startsWith(str))
      if (userUsernameStartsWith) return userUsernameStartsWith.user

      const userUsernameStartsWithAndLowercase = this.useStartsWith && this.checkUsername && this.useLowerCase && guild.members.find(m => m.user.username.toLowerCase().startsWith(str.toLowerCase()))
      if (userUsernameStartsWithAndLowercase) return userUsernameStartsWithAndLowercase.user

      const userNickStartsWith = this.useStartsWith && this.checkNick && guild.members.find(m => m.nickname && m.nickname.startsWith(str))
      if (userNickStartsWith) return userNickStartsWith.user

      const userNickStartsWithAndLowercase = this.checkNick && this.useLowerCase && this.useStartsWith && guild.members.find(m => m.nickname && m.nickname.toLowerCase().startsWith(str.toLowerCase()))
      if (userNickStartsWithAndLowercase) return userNickStartsWithAndLowercase.user
    }

    const userUsername = this.checkUsername && users.find(u => u.username === str)
    if (userUsername) return userUsername

    const userUsernameLowercase = this.checkUsername && this.useLowerCase && users.find(u => u.username.toLowerCase() === str.toLowerCase())
    if (userUsernameLowercase) return userUsernameLowercase

    const userUsernameStartsWith = this.checkUsername && this.useStartsWith && users.find(u => u.username.startsWith(str))
    if (userUsernameStartsWith) return userUsernameStartsWith

    const userUsernameStartsWithAndLowercase = this.useLowerCase && this.checkUsername && this.useStartsWith && users.find(u => u.username.toLowerCase().startsWith(str.toLowerCase()))
    if (userUsernameStartsWithAndLowercase) return userUsernameStartsWithAndLowercase

    if (resultRegex && this.checkUserGlobal) {

    }

    if (resultRegex && this.checkUserGlobal) {
      try {
        const user = await users.fetch(resultRegex[0], false)
        return user
      } catch (_) {

      }
    }
  }
}

module.exports = User
