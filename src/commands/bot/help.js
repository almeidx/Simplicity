'use strict';

const { Command, CommandError, SimplicityEmbed } = require('@structures');
const { getHelp } = require('@util/CommandUtil');
const { verifyDev } = require('@util/PermissionUtil');

class Help extends Command {
  constructor(client) {
    super(client, {
      aliases: ['h', 'commands', 'cmd', 'cmds', 'howtouse'],
      category: 'bot',
      name: 'help',
    }, [
      {
        required: false,
        type: 'string',
      },
    ]);
  }

  async run({ author, client, prefix, send, t }, cmdName) {
    const categories = client.categories;

    if (!cmdName) {
      const embed = new SimplicityEmbed({ author, t }, { autoAuthor: false })
        .setAuthor(client.user)
        .setDescription('commands:help.about', { name: client.user.username, prefix });
      categories.each((cmds, i) => {
        if (i === 'dev' && !verifyDev(author.id, client)) return;
        return embed.addField(`categories:${i}.name`, cmds.keyArray().map((c) => `\`${c}\``).join(', '));
      });
      return send(embed);
    }

    const command = client.commands.fetch(cmdName.toLowerCase());
    if (!command) throw new CommandError('commands:help.commandUndefined');

    const embed = await getHelp({ client, command, prefix, t });
    return send(embed);
  }
}

module.exports = Help;
