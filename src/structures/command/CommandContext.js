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

  _emoji (name = 'QUESTION', id = false) {
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

  _send (embed, options, optionsMessage = {}) {
    options = Object.assign({ error: false, convertText: true, authorFooter: true, title: {}, description: {} }, options)
    if (embed instanceof MessageEmbed) {
      if (embed.title && embed.title.includes(':') && !embed.description.includes(' ')) {
        embed.title = this.t(embed.title, options.title)
      }
      if (embed.description && embed.description.includes(':') && !embed.description.includes(' ')) {
        embed.description = (options.error ? this.emoji('ERROR') + ' ' : '') + this.t(embed.description, options.description)
      }
      if (embed.fields !== 0) embed.fields = embed.fields.map((f) => ({ name: this.t(f.name), value: this.t(f.value), inline: f.inline }))
      if (embed.author) embed.author.name = this.t(embed.author.name)
      embed.setTimestamp()

      const COLOR = process.env.COLOR ? process.env.COLOR : this.guild.me.displayColor !== 0 ? this.guild.me.displayColor : this.member.displayColor !== 0 ? this.member.displayColor : 'GREEN'
      if (!embed.color) embed.setColor(options.error ? 'RED' : COLOR)
      if (options.authorFooter || !embed.footer || embed.footer.text === '') embed.setFooter(this.author.tag, this.author.displayAvatarURL())

      if (this.convertText && !this.channel.permissionsFor(this.guild.me).has('EMBED_LINKS')) {
        let message = []
        if (embed.title) message.push(`**${embed.title}**`)
        if (embed.description) message.description(embed.description)
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
