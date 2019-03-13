const { LogUtils } = require('../')
const LOG_SECTORS = ['USER_CHANGES', 'GUILD_CHANGES', 'BOT_LOGS']

class Listener extends LogUtils {
  constructor (client, options = {}) {
    super()
    options = Object.assign({ logSector: 'none' }, options)
    this.client = client
    this.name = ''
    this.logSector = options.logSector

    if (this.logSector !== 'none' && !LOG_SECTORS.includes(this.logSector.toLowerCase())) {
      throw new Error(`${this.constructor.name}: Invalid Sector`)
    }
  }

  on () { }

  sendMessage (type, embed) {
    const channel = process.env[type] && this.client.channels.get(process.env[type])

    if (channel) {
      return channel.send(embed)
    } else {
      return console.error(`${type} is not a valid type`)
    }
  }
}

module.exports = Listener
