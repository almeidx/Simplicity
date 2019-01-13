const { Constants } = require('../')

class CommandContext {
  constructor (options) {
    Object.setPrototypeOf(this, options.message)
    this.message = options.message
    this.voiceChannel = options.message.member.voiceChannel
    this.prefix = options.prefix
    this.command = options.command
    this.language = options.language
    this.query = options.query
  }
  emoji (name = 'QUESTION', id = false) {
    name = name.toUpperCase()
    let result
    if (this.guild && this.guild.me.permissions.has('USE_EXTERNAL_EMOJIS')) {
      const emoji = this.client.emojis.get(Constants.EMOJIS_CUSTOM[name])
      if (emoji) {
        result = id ? Constants.EMOJIS_CUSTOM[name] : `<${emoji.animated ? 'a:' : ''}${emoji.name}:${emoji.id}>`
      }
    }
    return result || Constants.EMOJIS[name] || '❓'
  }
}

module.exports = CommandContext
