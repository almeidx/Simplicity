const moment = require('moment')
const { Listener } = require('../..')

class DisconnectListener extends Listener {
  constructor (client) {
    super(client)
  }
  
  on (client) {
    console.log(`The bot has disconnected at ${moment().format('LLL')}`)
  }
}

module.exports = DisconnectListener
