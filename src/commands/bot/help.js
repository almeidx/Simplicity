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
      const userIsDev = verifyDev(author.id, client);
      categories.each((cmds, i) => {
        if (i === 'dev' && !userIsDev) return;
        return embed.addField(
          `categories:${i}.name`,
          cmds
            .array()
            .filter((c) => {
              const x = Help.isDevCommand(c) ? userIsDev : true;
              console.log(c.name, x);
              return x;
            })
            .map((c) => `\`${c.name}\``)
            .join(', '));
      });
      return send(embed);
    }

    const command = client.commands.fetch(cmdName.toLowerCase());
    if (!command) throw new CommandError('commands:help.commandUndefined');

    const embed = await getHelp({ client, command, prefix, t });
    return send(embed);
  }

  static isDevCommand(command) {
    return command.category === 'dev' || (command.requirements && command.requirements.ownerOnly);
  }
}

module.exports = Help;
