'use strict';

const { RoleParameter } = require('@parameters');
const { Command, CommandError } = require('@structures');

class AutoRole extends Command {
  constructor(client) {
    super(client, {
      aliases: ['roleauto', 'joinrole'],
      category: 'module',
      cooldown: 30000,
      name: 'autorole',
      requirements: {
        guildOnly: true,
        requireDatabase: true,
        userPermissions: ['MANAGE_GUILD'],
      },
    });
  }

  async run({ channel, database, guild, guildData, query, t }) {
    let msg, role = null;
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

    await database.guilds.edit(guild.id, { autorole: role });

    await channel.send(msg);
  }
}

module.exports = AutoRole;
