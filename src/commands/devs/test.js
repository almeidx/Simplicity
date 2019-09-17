'use strict';

const { Command } = require('../../');

class Test extends Command {
  constructor(client) {
    super(client, {
      category: 'dev',
      requirements: {
        ownerOnly: true,
      },
    });
  }

  async run({ send }) {
    send('What?');
  }
}

module.exports = Test;
