const { SimplicityListener } = require('../..')

class Invalidated extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on () {
    console.log('The client\'s session has became invalidated.')
    process.exit(1)
  }
}

module.exports = Invalidated
