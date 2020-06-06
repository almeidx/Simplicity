'use strict';

const { Logger, SimplicityEmbed, SimplicityListener } = require('@structures');
const { cleanString } = require('@util/Util');

class ErrorListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(_, error) {
    Logger.error(`[Error]\n${error.stack}`);

    this.sendPrivateMessage('ERROR_LOG_CHANNEL',
      new SimplicityEmbed()
        .setError()
        .setDescription(cleanString(error.stack)));
  }
}

module.exports = ErrorListener;
