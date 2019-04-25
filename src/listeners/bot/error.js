const { SimplicityEmbed, SimplicityListener, Utils } = require('../..')
const { cleanString } = Utils

class ErrorListener extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (client, error) {
    client.logger.error('Error', error)

    this.sendPrivateMessage('channel_log_error',
      new SimplicityEmbed()
        .setError()
        .setDescription(cleanString(error.stack)))
  }
}

module.exports = ErrorListener
