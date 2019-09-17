'use strict';

const { SimplicityEmbed, Logger, SimplicityListener, Utils: { cleanString } } = require('../..');

class ErrorListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(client, error) {
    Logger.error(`[Error]\n${error.stack}`);

    this.sendPrivateMessage('channel_log_error',
      new SimplicityEmbed()
        .setError()
        .setDescription(cleanString(error.stack)));
  }
}

module.exports = ErrorListener;
