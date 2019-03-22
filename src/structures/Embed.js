const { MessageEmbed, User, GuildMember, Message, Guild } = require('discord.js')
const { CommandContext } = require('../')

const types = { normal: process.env.COLOR, error: 'RED', warn: 0xfdfd96 }

function checkName (resolvable) {
  if (resolvable instanceof User) return resolvable.tag
  if (resolvable instanceof GuildMember) return resolvable.user.tag
  if (resolvable instanceof Guild) return resolvable.name
}

function checkIcon (resolvable) {
  const o = { size: 2048 }
  if (resolvable instanceof User) return resolvable.displayAvatarURL(o)
  if (resolvable instanceof GuildMember) return resolvable.user.displayAvatarURL(o)
  if (resolvable instanceof Guild) return resolvable.displayAvatarURL(o)
}

class SimplicityEmbed extends MessageEmbed {
  constructor (embedResolvable = {}, options = {}, data = {}) {
    super(data)
    this.setup(embedResolvable, options)
    this.dataFixedT = {}
    this.fieldsFixedT = []
  }

  setup (embedResolvable, options) {
    this.options = Object.assign({
      autoFooter: true,
      autoAuthor: false,
      autoTimestamp: true,
      type: 'normal'
    }, options)

    if (embedResolvable instanceof User) embedResolvable = { author: embedResolvable }
    if (embedResolvable instanceof GuildMember) embedResolvable = { author: embedResolvable.user }

    if (typeof embedResolvable === 'function') {
      if (embedResolvable.name === 'fixedT') embedResolvable = { t: embedResolvable }
    }

    if (embedResolvable instanceof Message) {
      const context = new CommandContext({ message: embedResolvable })
      embedResolvable = {
        author: context.author,
        t: context.t
      }
    }

    embedResolvable = Object.assign({ author: null, t: null }, embedResolvable)

    this.t = embedResolvable.t

    if (embedResolvable.author) {
      if (this.options.autoAuthor) this.setAuthor(embedResolvable.author)
      if (this.options.autoFooter) this.setFooter(embedResolvable.author)
      if (this.options.autoTimestamp) this.setTimestamp()
    }

    const color = types[this.options.type] || types.normal || 'GREEN'
    this.setColor(color)
  }

  setError () {
    return this.setColor('RED')
  }

  setAuthor (name, iconURL, url, options = {}) {
    const authorName = checkName(name)
    const authorNameIcon = checkIcon(iconURL)
    const authorIcon = checkIcon(iconURL)

    if (authorName) name = authorIcon
    if (authorNameIcon && !iconURL) iconURL = authorIcon
    if (authorIcon) iconURL = authorIcon

    return super.setAuthor(name, iconURL, url)
  }

  setFooter (text, iconURL, options = {}) {
    const footerTextName = checkName(text)
    const footerTextIcon = checkIcon(iconURL)
    const footerIcon = checkIcon(iconURL)

    if (footerTextName) text = checkName
    if (footerTextIcon && !iconURL) iconURL = footerTextIcon
    if (footerIcon) iconURL = footerIcon

    return super.setFooter(text, iconURL, text)
  }

  setDescription (description = {}) {
    return super.setDescription(description)
  }

  addField (name, value, inline, options = {}, valueOptions = {}) {
    return super.addField(name, value, inline)
  }

  setThumbnail (url) {
    const thumbnail = checkIcon(url) || url
    return super.setThumbnail(thumbnail)
  }

  setImage (url) {
    const image = checkIcon(url) || url
    return super.setImage(image)
  }
}

module.exports = SimplicityEmbed
