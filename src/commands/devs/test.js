'use strict';

const { Command, MessageCollectorUtils: { test } } = require('../../');

class Test extends Command {
  constructor(client) {
    super(client, {
      category: 'dev',
      requirements: {
        ownerOnly: true,
      },
    });
  }

  async run({ channel, message }) {
    const response = await test(message, 'What?', 30000);
    if (!response) return channel.send('no response bruh');
    await channel.send(response);
  }
}

module.exports = Test;
