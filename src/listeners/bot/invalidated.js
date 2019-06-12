const { SimplicityListener } = require('../..')

class Invalidated extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on () {
    console.log('The client\'s session is now invalidated.')
    process.exit(1)
  }
}

module.exports = Invalidated
