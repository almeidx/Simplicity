const Parameter = require('./Parameter')
const CommandError = require('../CommandError')
const REGEX_ID = /[0,9]{16,18}/g
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
      checkUserGlobal: false
    })

    this.acceptSelf = !!options.self
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser
    
    this.checkUserGlobal = !!options.checkUserGlobal
    this.checkNick = !!options.checkNick
    this.checkUsername = !!options.checkUsername
    this.checkID = !!options.checkID

    this.useLowerCase = !!options.useLowerCase

    this.errors = Object.assign({
      acceptBot: 'errors:acceptBot',
      acceptUser: 'errors:acceptUser',
      acceptSelf: 'errors:acceptSelf'
    }, options.errors)
  }

  async handle (context, args) {
    const str = args.join(' ') || ''
    const user = await this.getUser(context, str)
    if (!user) return null

    if (!this.acceptSelf && user.id === context.author.id) throw new CommandError(this.errors.acceptSelf)
    if (!this.acceptBot && user.bot) throw new CommandError(this.errors.acceptBot)
    if (!this.acceptUser && !user.bot) throw new CommandError(this.errors.acceptSelf)

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

      const userNick = this.checkNick && guild.members.find(m => m.nick && (m.nick === str))
      if (userNick) return userNick

      const userNickLowercase = this.checkNick && this.useLowerCase && guild.members.find(m => m.nick && (m.nick.toLowerCase() === str.toLowerCase()))
      if (userNickLowercase) return userNickLowercase.user
    }

    const userUsername = this.checkUsername && users.find(u => u.username === str)
    if (userUsername) return userUsername

    const userUsernameLowercase = this.checkUsername && this.useLowerCase && users.find(u => u.username.toLowerCase() === str.toLowerCase())
    if (userUsernameLowercase) return userUsernameLowercase

    const userGlobal = resultRegex && this.checkUserGlobal && ( await client.fetch(resultRegex[0]).catch(() => null))
    if (userGlobal) return userGlobal
  }
}

module.exports = User
