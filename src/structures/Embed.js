const { MessageEmbed } = require('discord.js')

class Embed extends MessageEmbed {
  constructor (options, data) {
    super(data)
    options = Object.assign({ message: null, author: null, t: null, emoji: null, autoFooter: true, autoAuthor: true, autoTimestamp: true }, options)

    this._message = options.message
    this._author = options.author
    this._t = options.t
    this._emoji = options.emoji

    if (this._message || this.author) {
      const msg = this._message
      const author = this.author || (msg && msg.author)

      if (options.autoFooter && author) this.setFooter(author.tag)

      if (options.autoAuthor) this.setAuthor(author.tag, author.displayAvatarURL())

      if (options.autoTimestamp) this.setTimestamp()
    }

    if (options.error) {
      this.setError()
    } else {
      const color = process.env.COLOR || 'GREEN'
      this.setColor(color)
    }

  }

  _tt (str = '', tOptions = {}) {
    if (!this._t) return str
    let result = String(str)
    const query = this._t(str, tOptions)
    if (result.includes(':') && result.split(':')[1] !== query) result = query
    if (tOptions.emoji && this._emoji) result = `${this._emoji(tOptions.emoji)} ${result}`
    return result
  }

  setError () {
    return this.setColor('RED')
  }

  setTitle () {
    return super.setTitle(this._tt(...arguments))
  }

  setAuthor (name, iconURL = null, url = null, tOptions = {}) {
    return super.setAuthor(this._tt(name, tOptions), iconURL, url)
  }

  setDescription () {
    return super.setDescription(this._tt(...arguments))
  }

  addField (name, value, inline, nameOptions = {}, valueOptions = {}) {
    return super.addField(this._tt(name, nameOptions), this._tt(value, valueOptions), inline)
  }
}

module.exports = Embed
