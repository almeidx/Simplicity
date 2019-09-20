'use strict';

const { SimplicityListener } = require('../..');
const StarboardHandler = require('../../utils/StarboardHandler');
class MessageReactionAddListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, reaction, user) {
    let c = true;
    if (reaction.message.partial) await reaction.message.fetch().catch((e) => {
      console.error(e.stack);
      c = false;
    });
    // Starboard
    if (!c) return;
    await StarboardHandler(client, reaction, user);
  }
}

module.exports = MessageReactionAddListener;
