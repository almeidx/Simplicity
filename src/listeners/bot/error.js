const { SimplicityEmbed, SimplicityListener } = require('../..')
const clean = (str) => str.toString().slice(0, 2045) + (str.toString().length > 2045 ? '...' : '')

class ErrorListener extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (client, error) {
    client.logger.error('Error', error)
    this.sendPrivateMessage('channel_log_error',
      new SimplicityEmbed()
        .setError()
        .setDescription(clean(error.stack))).catch(() => null)
  }
}

module.exports = ErrorListener
