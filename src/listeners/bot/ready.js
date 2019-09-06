'use strict';

const { SimplicityEmbed, SimplicityListener } = require('../..');

class ReadyListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(client) {
    const message = `Logged on ${client.guilds.size} guilds and ${client.users.size} users`;
    client.logger.success('Ready', message);

    this.sendPrivateMessage('bot_log',
      new SimplicityEmbed({ author: client.user })
        .setColor('GREEN')
        .setDescription(message));
  }
}

module.exports = ReadyListener;
