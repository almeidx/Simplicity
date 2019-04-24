const moment = require('moment')
const { SimplicityListener } = require('../..')

class DisconnectListener extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on () {
    console.log(`The bot has disconnected at ${moment().format('LLL')}`)
  }
}

module.exports = DisconnectListener
