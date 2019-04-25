const { SimplicityListener } = require('../../../index')

class ChannelUpdate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (_, oldChannel, newChannel) {}
}

module.exports = ChannelUpdate
