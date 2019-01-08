const { Message } = require('discord.js')
const Constants = require('./Constants')

class Emojis {
  static get (message = null) {
    if (message &&
      message instanceof Message &&
      message.guild.me.permissions.has('USE_EXTERNAL_EMOJIS') &&
      message.client.guilds.has(process.env.SERVER_ID)) {
      return Constants.EMOJIS_CUSTOM
    } else {
      return Constants.EMOJIS
    }
  }
}

module.exports = Emojis
