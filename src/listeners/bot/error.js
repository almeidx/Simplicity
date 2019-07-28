'use strict';

const { SimplicityEmbed, SimplicityListener, Utils: { cleanString } } = require('../..');

class ErrorListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(client, error) {
    client.logger.error('Error', error);

    this.sendPrivateMessage('channel_log_error',
      new SimplicityEmbed()
        .setError()
        .setDescription(cleanString(error.stack)));
  }
}

module.exports = ErrorListener;
