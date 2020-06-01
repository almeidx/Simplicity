'use strict';

const { Command, SimplicityEmbed } = require('@structures');

class ServerIcon extends Command {
  constructor(client) {
    super(client, 'servericon', {
      aliases: ['svicon', 'sicon', 'guildicon', 'gicon', 'icon'],
      category: 'guild',
    });
  }

  run({ author, guild, send, t }) {
    const embed = new SimplicityEmbed({ author, t })
      .setDescription('$$commands:servericon.text');

    embed.setImage(guild);

    return send(embed);
  }
}

module.exports = ServerIcon;
