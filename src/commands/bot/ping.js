'use strict';

const { Command } = require('@structures');

class Ping extends Command {
  constructor(client) {
    super(client, {
      aliases: ['pong'],
      category: 'bot',
      name: 'ping',
    });
  }

  async run({ message, send, t }) {
    const msg = await send(t('commands:ping.loading'));
    msg.edit(t('commands:ping.success', { ping: msg.createdTimestamp - message.createdTimestamp }));
  }
}

module.exports = Ping;
