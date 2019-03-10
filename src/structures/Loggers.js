const colors = require('colors')
const { LOG_COLORS, TAGS_LOGGERS } = require('../utils/Constants')
const parseTag = tag => String(tag).toUpperCase()
const checkTag = tag => TAGS_LOGGERS.includes(parseTag(tag))
const sharp = tag => colors[LOG_COLORS.COLOR_TAG]('#') + tag
const moment = require('moment')
moment.locale('pt-br')

class Logger {
  static timestamp (color) {
    return colors[LOG_COLORS[color]](`[${moment().format('DD/MM/YYYY HH:mm:ss')}] `)
  }

  static checkTags (tags) {
    if (Array.isArray(tags) && !tags.every(checkTag)) return false
    else if (!checkTag(tags)) return false
    else return true
  }

  static convertTags (tags) {
    if (Array.isArray(tags)) {
      return tags.map(sharp).join(' ')
    } else {
      return sharp(tags)
    }
  }

  static _lowg (color, text, tags) {
    const tag = this.checkTags(tags) && this.convertTags(tags)
    if (!tag) text = text + ' ' + tag
    else text = tag + text
    return console.log(this.timestamp(color) + text)
  }

  static _log (context, colors) {
    context = Object.assign({ tags: [], text: '' }, context)
    colors = Object.assign({ tags: 'bgGreen', text: null }, colors)
    return this._lowg(colors.tags, context.text, context.tags)
  }
  static log (tags = [], ...args) {
    return this._log({ tags, text: args.join(' ') })
  }
  static error (tags = [], ...args) {
    return this._log({ tags, text: args.join(' ') }, { tags: 'bgRed' })
  }
  static warn (tags = [], ...args) {
    return this._log({ tags, text: args.join(' ') }, { tags: 'bgYellow' })
  }
}
module.exports = Logger
