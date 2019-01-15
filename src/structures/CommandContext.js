const Constants = require('../utils/Constants')
class CommandContext {
  constructor (options) {
    this.message = options.message
    this.author = options.message.author
    this.channel = options.message.channel
    this.client = options.message.client
    this.voiceChannel = options.message.member.voiceChannel
    this.prefix = options.prefix
    this.command = options.command
    this.language = Object.keys(options.message.client.i18next.store.data).includes(options.language) ? options.language : process.env.DEFAULT_LANG
    this.query = options.query
    this.args = options.args
    this.t = options.message.client.i18next.getFixedT(options.language)
  }
  emoji (name = 'QUESTION', id = false) {
    name = name.toUpperCase()
    let result
    if (this.guild && this.guild.me.permissions.has('USE_EXTERNAL_EMOJIS') && Constants.EMOJIS_CUSTOM && Constants.EMOJIS_CUSTOM[name]) {
      const emoji = this.client.emojis.get(Constants.EMOJIS_CUSTOM[name])
      if (emoji) {
        result = id ? Constants.EMOJIS_CUSTOM[name] : `<${emoji.animated ? 'a:' : ''}${emoji.name}:${emoji.id}>`
      }
    }
    return result || Constants.EMOJIS[name] || '❓'
  }
}

module.exports = CommandContext
