'use strict';

const { SimplicityEmbed, SimplicityListener } = require('@structures');
const Logger = require('@util/Logger');

class ReadyListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(client) {
    const message = `Logged on ${client.guilds.cache.size} guilds and ${client.users.cache.size} users`;
    Logger.log(`[Ready] ${message}`);

    this.sendPrivateMessage('bot_log',
      new SimplicityEmbed({ author: client.user })
        .setColor('GREEN')
        .setDescription(message));
  }
}

module.exports = ReadyListener;
