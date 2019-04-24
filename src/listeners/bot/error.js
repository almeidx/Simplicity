const { SimplicityEmbed, SimplicityListener, Loggers } = require('../..')

class ErrorListener extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (client, error) {
    Loggers.error('Error', error)
    this.sendMessage('channel_log_error',
      new SimplicityEmbed(client.user, { type: 'error' })
        .setDescription(error.stack))
  }
}

module.exports = ErrorListener
