'use strict';

const { Logger, SimplicityEmbed, SimplicityListener } = require('@structures');
const { cleanString } = require('@utils/Utils');

class ErrorListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(_, error) {
    Logger.error(`[Error]\n${error.stack}`);

    this.sendPrivateMessage('channel_log_error',
      new SimplicityEmbed()
        .setError()
        .setDescription(cleanString(error.stack)));
  }
}

module.exports = ErrorListener;
