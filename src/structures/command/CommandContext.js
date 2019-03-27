const Constants = require('../../utils/Constants')
const Embed = require('../Embed')

const getCustomEmoji = (id) => Constants.EMOJIS_CUSTOM && Constants.EMOJIS_CUSTOM[id]
const getDefaultEmoji = (name) => Constants.EMOJIS && Constants.EMOJIS[name]

class CommandContext {
  constructor (options) {
    this.message = options.message
    this.member = options.message.member
    this.guild = options.message.guild
    this.author = options.message.author
    this.channel = options.message.channel
    this.client = options.message.client
    this.voiceChannel = options.message.member.voiceChannel

    this.prefix = options.prefix
    this.command = options.command
    this.language = Object.keys(options.message.client.i18next.store.data).includes(options.language) ? options.language : (this.message.language || process.env.DEFAULT_LANG)
    this.query = options.query
    this.args = options.args
    this.t = options.message.client.i18next.getFixedT(this.language)
    this.emoji = this._emoji.bind(this)
    this.send = this._send.bind(this)

    this.message.language = this.language
  }

  _emoji (name = 'QUESTION', options) {
    const { id, othur } = Object.assign({ id: false, othur: null }, options)
    name = name.toUpperCase()

    const custom = getCustomEmoji(name) || (othur && getCustomEmoji(othur))
    const normal = getDefaultEmoji(name) || (othur && getDefaultEmoji(othur))

    if (this.guild && this.channel.permissionsFor(this.guild.me).has('USE_EXTERNAL_EMOJIS') && custom) {
      const emoji = this.client.emojis.get(custom)
      if (emoji) return id ? emoji.id : emoji.toString()
    }
    return normal || false
  }

  _send (embed, options) {
    options = Object.assign({ convertText: true }, options)
    if (embed instanceof Embed) {
      if (options.convertText && !this.channel.permissionsFor(this.guild.me).has('EMBED_LINKS')) {
        const message = []

        if (embed.title) message.push(`**${embed.title}**`)
        if (embed.description) message.push(embed.description)
        if (embed.fields.length !== 0) embed.fields.forEach(e => message.push(`**${e.name}\n${e.value}`))
        return this.channel.send(message, options)
      }
      options.embed = embed
      return this.channel.send(options)
    }
    return this.channel.send(embed)
  }
}

module.exports = CommandContext
