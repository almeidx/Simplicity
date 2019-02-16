const Parameter = require('../Parameter')
const CommandError = require('../CommandError')
class User extends Parameter {
  constructor (options, query) {
    super(options, query)

    options = Object.assign({
      acceptBot: true,
      acceptDeveloper: true,
      acceptUser: true,
      acceptSelf: true,
      checkID: true,
      checkNick: true,
      checkUsername: true,
      useLowerCase: true,
      firstArg: true,
      getMulti: false
    })

    this.acceptSelf = !!options.self
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser

    this.checkNick = !!options.checkNick
    this.checkUsername = !!options.checkUsername
    this.checkID = !!options.checkID

    this.useLowerCase = !!options.useLowerCase
    this.firstArg = !!options.firstArg
    this.getMulti = !!options.getMulti

    this.errors = Object.assign({
      acceptBot: 'errors:acceptBot',
      acceptUser: 'errors:acceptUser',
      acceptSelf: 'errors:acceptSelf'
    }, options.errors)
  }

  handle ({ author, guild, client }, query) {
    if (this.firstArg) {
      query = query.split(' ')[0] || query
    }
    if (this.useLowerCase) {
      query = query.toLowerCase()
    }

    const id = query.split(' ')[0]
    const REGEX_ID = 
    if (this.checkID && ) {
      try {}
      const user = client.users.fetch()
    }
  }

  detect (user, authorID) {
    if (!this.acceptBot && user.bot) {
      throw new CommandError(this.errors.acceptBot)
    }
    if (!this.acceptUser && !user.bot) {
      throw new CommandError(this.errors.acceptUser)
    }
    if (!this.acceptSelf && user.id === authorID) {
      throw new CommandError(this.errors.acceptSelf)
    }
    return user
  }
}

module.exports = User
