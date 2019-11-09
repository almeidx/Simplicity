'use strict';

const { Command, CommandError, SimplicityEmbed } = require('@structures');
const { verifyDev } = require('@utils/PermissionUtils');
const { getHelp } = require('@command/CommandUtils');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['h', 'commands', 'cmd', 'cmds', 'howtouse'],
      category: 'bot',
    }, [
      {
        type: 'string',
        required: false,
      },
    ]);
  }

  async run({ author, client, prefix, send, t }, cmdName) {
    const categories = client.categories;

    if (!cmdName) {
      const embed = new SimplicityEmbed({ author, t }, { autoAuthor: false })
        .setAuthor(client.user)
        .setDescription('commands:help.about', { prefix, name: client.user.username });
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
