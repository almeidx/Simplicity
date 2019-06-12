const { SimplicityListener } = require('../..')

class Warn extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (_, warn) {
    console.log('Warning:\n', warn)
  }
}

module.exports = Warn
