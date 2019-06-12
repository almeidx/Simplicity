const { SimplicityListener } = require('../..')

class Disconnect extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on () {
    console.log('Bot is disconnecting...')
  }
}

module.exports = Disconnect
