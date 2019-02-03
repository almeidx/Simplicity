const Constants = require('../../utils/Constants')
const { MessageEmbed } = require('discord.js')

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
    this.language = Object.keys(options.message.client.i18next.store.data).includes(options.language) ? options.language : process.env.DEFAULT_LANG
    this.query = options.query
    this.args = options.args
    this.t = options.message.client.i18next.getFixedT(options.language)
    this.emoji = this._emoji.bind(this)
    this.send = this._send.bind(this)
  }
  _emoji (name = 'QUESTION', options) {
    const { id, noEmoji } = Object.assign({ id: false, noEmoji: false }, options)
    name = name.toUpperCase()
    if (this.guild && this.channel.permissionsFor(this.guild.me).has('USE_EXTERNAL_EMOJIS') && Constants.EMOJIS_CUSTOM && Constants.EMOJIS_CUSTOM[name]) {
      const emoji = this.client.emojis.get(Constants.EMOJIS_CUSTOM[name])
      if (emoji) {
        return id ? emoji.id : emoji.toString()
      }
    }
    return Constants.EMOJIS[name] || (noEmoji ? '' : '❓')
  }

  _send (embed, options, optionsMessage = {}) {
    options = Object.assign({ error: false, convertText: true, autoFooter: true, autoAuthor: true, options: {} }, options)
    const tOptions = Object.assign({ title: {}, description: {} }, options.options)

    if (embed instanceof MessageEmbed) {
      embed.setTimestamp()

      const checkGetT = (text) => text.includes(':') && !text.includes(' ')
      const COLOR = process.env.COLOR ? process.env.COLOR : this.guild.me.displayColor !== 0 ? this.guild.me.displayColor : this.member.displayColor !== 0 ? this.member.displayColor : 'GREEN'

      if (embed.title && checkGetT(embed.title)) {
        embed.title = this.t(embed.title, tOptions.title)
      }

      if (embed.description && checkGetT(embed.description)) {
        embed.description = (options.error ? this.emoji('ERROR') + ' ' : '') + this.t(embed.description, tOptions.description)
      }

      if (embed.fields !== 0) {
        embed.fields = embed.fields.map((f) => ({
          name: checkGetT(f.name) ? this.t(f.name) : f.name,
          value: checkGetT(f.value) ? this.t(f.value) : f.value,
          inline: f.inline }))
      }

      if (embed.author && embed.author.name && checkGetT(embed.author.name)) {
        embed.author.name = this.t(embed.author.name)
      }

      if (!embed.color) {
        embed.setColor(options.error ? 'RED' : COLOR)
      }

      if (options.autoFooter) {
        embed.setFooter(`${this.t('utils:footer')} ${this.author.tag}`, this.author.displayAvatarURL({ size: 2048 }))
      }

      if (options.autoAuthor) {
        embed.setAuthor(this.author.username, this.author.displayAvatarURL({ size: 2048 }))
      }

      if (options.convertText && !this.channel.permissionsFor(this.guild.me).has('EMBED_LINKS')) {
        let message = []
        if (embed.title) message.push(`**${embed.title}**`)
        if (embed.description) message.push(embed.description)
        if (embed.fields.length !== 0) embed.fields.forEach(e => message.push(`**${e.name}\n${e.value}`))

        return this.channel.send(message, optionsMessage)
      }

      optionsMessage.embed = embed
      return this.channel.send(optionsMessage)
    }
    return this.channel.send(embed)
  }
}
module.exports = CommandContext
