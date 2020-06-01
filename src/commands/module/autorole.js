'use strict';

const { Command, CommandError } = require('@structures');

class AutoRole extends Command {
  constructor(client) {
    super(client, 'autorole', {
      aliases: ['roleauto', 'joinrole'],
      args: [
        {
          clientHasHigh: true,
          required: false,
          type: 'role',
        },
      ],
      category: 'module',
      cooldown: 5000,
      requirements: {
        guildOnly: true,
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
    },
    );
  }

  async run({ channel, database, guild, guildData, t }, role) {
    if (!role && !guildData.autrole) {
      throw new CommandError('commands:autorole.requireRole', { onUsage: true });
    }

    if (!role && guildData.autrole) {
      await database.guilds.edit(guild.id, { autorole: null });
      return channel.send(t('commands:autorole.disabled'));
    }

    if (guildData.autorole === role.id) {
      throw new CommandError('commands.autorole.isCurrentRole');
    }

    await database.guilds.edit(guild.id, { autorole: role.id });
    if (!guildData.autrole) channel.send(t('commands:autorole.enabled', { role: role.name }));
    else channel.send(t('commands:autorole.changed', { role: role.name }));
  }
}

module.exports = AutoRole;
