const colors = require('colors')
const { LOG_COLORS } = require('../utils/Constants')
const getText = (color, text) => colors[(LOG_COLORS[color] || color)](text)
const moment = require('moment')
moment.locale('pt-br')

class Logger {
  static get timestamp () {
    return getText('gray', `[${moment().format('DD/MM/YYYY HH:mm:ss')}] `)
  }

  static log (color, tag, text) {
    return console.log(`${this.timestamp}${getText('COLOR_TAG', `[${tag}]`)} ${getText(color, text)}`)
  }

  static success (tag, text) {
    return this.log('SUCCESS', tag, text)
  }

  static error (tag, text) {
    return this.log('ERROR', tag, text)
  }

  static commandUsage (tag, text) {
    return this.log('COMMAND_USAGE', tag, text)
  }
}

module.exports = Logger
