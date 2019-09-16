'use strict';

const { Command } = require('../../');

class Ping extends Command {
  constructor(client) {
    super(client, {
      aliases: ['pong'],
      category: 'bot',
    });
  }

  async run({ message, send, t }) {
    const msg = await send('commands:ping.loading');
    msg.edit(t('commands:ping.success', { ping: msg.createdTimestamp - message.createdTimestamp }));
  }
}

module.exports = Ping;
