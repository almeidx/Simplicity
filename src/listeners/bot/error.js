const { Embed, Listener, Loggers } = require('../..')

class ErrorListener extends Listener {
  constructor (client) {
    super(client)
  }

  on (client, error) {
    Loggers.error('Error', error)
    this.sendMessage('channel_log_error',
      new Embed(client.user, { type: 'error' }))
      .setDescription(error.stack)
  }
}

module.exports = ErrorListener
