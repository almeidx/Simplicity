'use strict';

const { Command, CommandError, CommandUtils, SimplicityEmbed } = require('@structures');
const { PermissionsUtils } = require('@utils');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['h', 'commands', 'cmd', 'cmds', 'howtouse'],
      category: 'bot',
    });
  }

  async run({ author, client, prefix, query, send, t }) {
    const categories = client.categories;

    if (!query) {
      const embed = new SimplicityEmbed({ author, t }, { autoAuthor: false })
        .setAuthor(client.user)
        .setDescription('commands:help.about', { prefix, name: client.user.username });
      categories.each((cmds, i) => {
        if (i === 'dev' && !PermissionsUtils.verifyDev(author.id, client)) return;
        return embed.addField(`categories:${i}.name`, cmds.keyArray().map((c) => `\`${c}\``).join(', '));
      });
      return send(embed);
    }

    const command = client.commands.fetch(query.toLowerCase());
    if (!command) throw new CommandError('commands:help.commandUndefined');

    const embed = await CommandUtils.getHelp({ client, command, prefix, t });
    return send(embed);
  }
}

module.exports = Help;
