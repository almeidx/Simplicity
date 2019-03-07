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
      argFirst: false,
      onlyRoleHighest: false,
      onlyBotRoleHighest: false
    }, options)

    this.acceptSelf = !!options.self
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser

    this.onlyRoleHighest = !!options.onlyRoleHighest
    this.onlyBotRoleHighest = !!options.onlyBotRoleHighest

    this.checkNick = !!options.checkNick
    this.checkUsername = !!options.checkUsername
    this.checkID = !!options.checkID
    this.argFirst = !!options.argFirst

    this.useStartsWith = !!options.useStartsWith
    this.useLowerCase = !!options.useLowerCase

    this.errors = Object.assign({
      acceptBot: 'errors:acceptBot',
      acceptUser: 'errors:acceptUser',
      acceptSelf: 'errors:acceptSelf',
      onlyRoleHighest: 'errors:userMissingRole',
      onlyBotRoleHighest: 'errors:clientMissingRole'
    }, options.errors)
  }

  async handle ({ member: memberAuthor, author, guild, command, t }, args) {
    const member = args.length > 0 && await this.getMember(guild, this.argFirst ? args[0] : args.join(' '))
    if (!member) return null

    if (!this.acceptSelf && member.user.id === author.id) throw new CommandError(this.errors.acceptSelf)
    if (!this.acceptBot && member.user.bot) throw new CommandError(this.errors.acceptBot)
    if (!this.acceptUser && !member.user.bot) throw new CommandError(this.errors.acceptSelf)
    if (this.onlyRoleHighest && member.roles.highest.position >= memberAuthor.roles.highest.position) throw new CommandError(this.errors.onlyRoleHighest, { action: t(`commands:${command.name}.action`) })
    if (this.onlyBotRoleHighest && guild.me.roles.highest.position <= member.roles.highest.position) throw new CommandError(this.errors.onlyBotRoleHighest, { action: t(`commands:${command.name}.action`) })
    return member
  }

  getMember (guild, str) {
    const resultRegex = this.checkID && REGEX_ID.exec(str)
    const userRegex = resultRegex && guild.members.get(resultRegex[0])
    if (userRegex) return userRegex

    const memberName = this.checkUsername && guild.members.find(m => m.user.username === str)
    if (memberName) return memberName.user

    const memberNameLower = this.checkUsername && this.useLowerCase && guild.members.find(m => m.user.username.toLowerCase() === str.toLowerCase())
    if (memberNameLower) return memberNameLower.user

    const memberNick = this.checkNick && guild.members.find(m => m.nickname && (m.nickname === str))
    if (memberNick) return memberNick

    const memberNickLower = this.checkNick && this.useLowerCase && guild.members.find(m => m.nickname && (m.nickname.toLowerCase() === str.toLowerCase()))
    if (memberNickLower) return memberNickLower.user

    const memberStartName = this.useStartsWith && this.checkUsername && guild.members.find(m => m.user.username.startsWith(str))
    if (memberStartName) return memberStartName.user

    const userUsernameStartsWithAndLowercase = this.useStartsWith && this.checkUsername && this.useLowerCase && guild.members.find(m => m.user.username.toLowerCase().startsWith(str.toLowerCase()))
    if (userUsernameStartsWithAndLowercase) return userUsernameStartsWithAndLowercase.user

    const userNickStartsWith = this.useStartsWith && this.checkNick && guild.members.find(m => m.nickname && m.nickname.startsWith(str))
    if (userNickStartsWith) return userNickStartsWith.user

    const userNickStartsWithAndLowercase = this.checkNick && this.useLowerCase && this.useStartsWith && guild.members.find(m => m.nickname && m.nickname.toLowerCase().startsWith(str.toLowerCase()))
    if (userNickStartsWithAndLowercase) return userNickStartsWithAndLowercase.user
  }
}

module.exports = User
