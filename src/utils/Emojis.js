const { Message } = require('discord.js')
const Constants = require('./Constants')

class Emojis {
  static get (message = null, id = 'question', full = true) {
    id = id.toUpperCase()
    if (message &&
      message instanceof Message &&
      message.guild.me.permissions.has('USE_EXTERNAL_EMOJIS') &&
      message.client.guilds.has(process.env.SERVER_ID)) {
      let result = Constants.EMOJIS_CUSTOM[id]
      let emoji = message.client.emojis.get(result)
      if (emoji) {
        if (full) {
          result = `<${emoji.animated ? 'a:' : ''}${emoji.name}:${emoji.id}>`
        }
      } else {
        result = null
      }
      return result !== null ? result : Constants.EMOJIS[id]
    } else {
      return Constants.EMOJIS[id] || null
    }
  }
}

module.exports = Emojis
