const { MessageEmbed, User, GuildMember, Message, Guild } = require('discord.js')
const { CommandContext, TextUtils } = require('../')

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
    this.setupEmbed(embedResolvable, options)
    this.dataFixedT = {}
    this.fieldsFixedT = []
  }

  setupEmbed (embedResolvable, options) {
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

  setAuthor (name = '', iconURL = null, url = null, options = {}) {
    const authorName = checkName(name)
    const authorNameIcon = checkIcon(iconURL)
    const authorIcon = checkIcon(iconURL)

    if (authorName) name = authorIcon
    if (authorNameIcon && !iconURL) iconURL = authorIcon
    if (authorIcon) iconURL = authorIcon

    this.dataFixedT['author'] = { name, iconURL, url, options }
    return super.setAuthor(TextUtils.parse(name, options), iconURL, url)
  }

  setFooter (text = '', iconURL = null, options = {}) {
    const footerTextName = checkName(text)
    const footerTextIcon = checkIcon(iconURL)
    const footerIcon = checkIcon(iconURL)

    if (footerTextName) text = checkName
    if (footerTextIcon && !iconURL) iconURL = footerTextIcon
    if (footerIcon) iconURL = footerIcon

    this.dataFixedT['footer'] = { text, iconURL, options }
    return super.setFooter(TextUtils.parse(text, options), iconURL)
  }

  setDescription (description, options = {}) {
    this.dataFixedT['description'] = { description, options }
    return super.setDescription(TextUtils.parse(description, options))
  }

  addField (name = '', value = '', inline = null, options = {}, valueOptions = {}) {
    this.fieldsFixedT.push({ name, value, inline, options, valueOptions })
    return super.addField(TextUtils.parse(name, options), TextUtils.parse(value, valueOptions), inline)
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
