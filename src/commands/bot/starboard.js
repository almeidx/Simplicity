'use strict';

const { Command, SimplicityEmbed } = require('../..');

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: 'starboard',
      category: 'bot',
      cooldown: 60000,
      requirements: {
        requireDatabase: true,
        permissions: ['MANAGE_GUILD'] },
    });
  }

  async run({}) {
    
  }
}

module.exports = Prefix;
