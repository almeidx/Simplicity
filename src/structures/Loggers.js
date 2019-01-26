const Colors = require('colors')
const Constants = require('../utils/Constants')
const moment = require('moment')
moment.locale('pt-br')

class Logger {
  static get timestamp () {
    return `[${moment().format('DD/MM/YYYY HH:mm:ss')}] `
  }
  static _log (context, colors) {
    context = Object.assign({ tags: [], text: '' }, context)
    colors = Object.assign({ tags: 'bgGreen', text: null }, colors)
    if (typeof context.tags === 'string' && !Constants.TAGS_LOGGERS.includes(context.tags)) {
      context.text = context.tags + ' ' + context.text
      context.tags = []
    }
    if (typeof context.tags === 'string') {
      context.tags = [context.tags]
    }
    let tag = context.tags.map(tag => String(tag).toUpperCase())
      .filter(tag => Constants.TAGS_LOGGERS.includes(tag))
      .map(tag => Colors.white(Colors[colors.tags](tag)))
      .join(' ')
    let text = colors.text ? Colors[colors.text](context.text) : context.text
    return console.log(`${this.timestamp + (tag !== '' ? tag : '')} ${text}`)
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
