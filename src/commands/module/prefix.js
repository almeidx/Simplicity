'use strict';

const { Command, SimplicityEmbed, CommandError } = require('@structures');

class Prefix extends Command {
  constructor(client) {
    super(client, 'prefix', {
      aliases: ['setprefix', 'p', 'setp', 'prefixset'],
      args: [
        {
          errors: { maxLength: 'commands:prefix.multiCharacters' },
          maxLength: 15,
          minLength: 1,
          type: 'string',
        },
      ],
      category: 'module',
      cooldown: 5000,
      requirements: {
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
    });
  }

  async run({ author, client, guild, prefix: currentPrefix, send, t }, prefix) {
    if (currentPrefix === prefix) throw new CommandError('commands:prefix.alreadySet', { prefix });

    const data = await client.database.guilds.edit(guild.id, { prefix }).catch(() => null);
    if (!data) throw new CommandError('commands:prefix.failed');

    const embed = new SimplicityEmbed({ author, t })
      .setTitle('$$commands:prefix.done')
      .setDescription('$$commands:prefix.success', { prefix });
    await send(embed);
  }
}

module.exports = Prefix;
