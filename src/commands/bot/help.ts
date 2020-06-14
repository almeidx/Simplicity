import {
  Command, CommandError, Embed, CommandUtil, SimplicityClient,
} from '../../structures';
import { PermissionUtil } from '../../util';
import CommandContext from '../../structures/command/CommandContext';

export default class Help extends Command {
  constructor(client: SimplicityClient) {
    super(client, 'help', {
      aliases: ['h', 'commands', 'cmd', 'cmds', 'howtouse'],
      args: [
        {
          optional: true,
          type: 'string',
        },
      ],
      category: 'bot',
    });
  }

  async run(ctx: CommandContext, cmdName: string): Promise<void> {
    const {
      client, author, prefix, send, t,
    } = ctx;

    if (!cmdName) {
      const embed = new Embed(author, { t, autoAuthor: false })
        .setAuthor(client.user || 'Help')
        .setDescription('$$commands:help.about', { name: client.user?.username, prefix });
      const userIsDev = PermissionUtil.verifyDev(author.id, client);

      client.commands.categories.each((cmds, i) => {
        if (i === 'dev' && !userIsDev) return;
        embed.addField(
          `$$categories:${i}.name`,
          cmds
            .array()
            .filter((c) => (Help.isDevCommand(c) ? userIsDev : true))
            .map((c) => `\`${c.name}\``)
            .join(', '),
        );
      });

      send(embed);
      return;
    }

    const command = client.commands.get(cmdName.toLowerCase());
    if (!command) {
      throw new CommandError('commands:help.commandUndefined');
    }

    const embed = await CommandUtil.getHelpEmbed(ctx);
    send(embed);
  }

  static isDevCommand(command: Command): boolean {
    return command.category === 'dev' || (command.requirements && command.requirements.ownerOnly);
  }
}
