'use strict';

const Arguments = require('@arguments');
const { Command, SimplicityEmbed, CommandError } = require('@structures');

class Prefix extends Command {
  constructor(client) {
    super(client, {
      aliases: ['setprefix', 'p', 'setp', 'prefixset'],
      category: 'module',
      cooldown: 5000,
      name: 'prefix',
      requirements: {
        argsRequired: true,
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
    });
  }

  async run({ message, author, client, guild, prefix: currentPrefix, query, send, t }) {
    const prefix = await Arguments.string.parse.call({
      errors: { maxLength: 'commands:prefix.multiCharacters' },
      maxLength: 15,
      minLength: 1,
    }, query, { message, t });

    if (currentPrefix === prefix) throw new CommandError('commands:prefix.alreadySet', { prefix });

    const data = await client.database.guilds.edit(guild.id, { prefix }).catch(() => null);
    if (!data) throw new CommandError('commands:prefix.failed');

    const embed = new SimplicityEmbed({ author, t })
      .setTitle('commands:prefix.done')
      .setDescription('commands:prefix.success', { prefix });
    await send(embed);
  }
}

module.exports = Prefix;
