'use strict';

const { Command, SimplicityEmbed, Utils: { cleanString } } = require('../../');
const { exec } = require('child_process');

class Exec extends Command {
  constructor(client) {
    super(client, {
      aliases: ['execute', 'run'],
      category: 'dev',
      requirements: {
        argsRequired: true,
        ownerOnly: true }
    });
  }

  run({ author, emoji, query, send, t }) {
    const embed = new SimplicityEmbed({ author, emoji, t }, { autoAuthor: false });

    exec(query, (error, stdout) => {
      if (error) {
        embed
          .setTitle('common:general')
          .setDescription(cleanString(error))
          .setError();
        return send(embed);
      } else {
        embed
          .setTitle('» $$commands:exec.result')
          .setDescription(cleanString(stdout));
        return send(embed);
      }
    });
  }
}

module.exports = Exec;
