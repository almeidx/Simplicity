const moment = require('moment')

function Disconnect () {
  console.log(`The bot has disconnected at ${moment().format('LLL')}`)
}

module.exports = Disconnect
