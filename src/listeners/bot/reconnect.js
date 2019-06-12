const { SimplicityListener } = require('../..')

class Reconnect extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on () {
    console.log('Bot is reconnecting...')
  }
}

module.exports = Reconnect
