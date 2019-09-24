'use strict';

const { Command, CommandError, Parameters: { RoleParameter } } = require('../../');

class AutoRole extends Command {
  constructor(client) {
    super(client, {
      name: 'autorole',
      aliases: ['roleauto', 'joinrole'],
      category: 'guild',
      cooldown: 30000,
      requirements: {
        userPermissions: ['MANAGE_GUILD'],
        requireDatabase: true,
        guildOnly: true,
      },
    });
  }

  async run({ channel, database, guild, guildData, query, t }) {
    let role = null, msg;
    if (!query && !guildData.autrole) {
      throw new CommandError('commands:autorole.requireRole', { onUsage: true });
    } else if (!query && guildData.autrole) {
      msg = t('commands:autorole.disabled');
    } else {
      const { name, id } = await RoleParameter.parse(query, {}, { guild });
      if (guildData.autorole === id) throw new CommandError('commands.autorole.isCurrentRole');

      if (!guildData.autrole) msg = t('commands:autorole.enabled', { role: name });
      else msg = t('commands:autor.changed', { role: name });

      role = id;
    }

    await database.guilds.edit(guild.id, {
      autorole: role,
    });

    await channel.send(msg);
  }
}

module.exports = AutoRole;
