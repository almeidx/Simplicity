const { MessageEmbed } = require('discord.js')

class Embed extends MessageEmbed {
  constructor (options, data) {
    super(data)
    options = Object.assign({ message: null, t: null, emoji: null, autoFooter: true, autoTimestamp: true }, options)

    this._message = options.message
    this._t = options.t
    this._emoji = options.emoji

    if (options.error) {
      this.setColor('RED')
    } else {
      let color = process.env.COLOR
      if (!color && this._message) {
        const colorClientGuild = this._message.guild && this.guild.me.displayColor
        const colorMemberGuild = this._message.member && this._message.member.displayColor
        color = colorClientGuild || colorMemberGuild || 'GREEN'
      }
      this.setColor(color)
    }

    if (options.autoFooter && this._message) {
      this.setFooter(this._message.author.tag)
    }

    if (options.autoTimestamp) {
      this.setTimestamp()
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

  setAuthor () {
    return super.setAuthor(this._tt(...arguments))
  }

  setDescription () {
    return super.setDescription(this._tt(...arguments))
  }

  addField (name, value, inline, nameOptions = {}, valueOptions = {}) {
    return super.addField(this._tt(name, nameOptions), this._tt(value, valueOptions), inline)
  }
}

module.exports = Embed
