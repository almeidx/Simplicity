'use strict';

const { Command } = require('@structures');
// const { RoleParameter } = require('@parameters');
const { Role } = require('discord.js');

class AutoRole extends Command {
  constructor(client) {
    super(client, {
      name: 'autorole',
      aliases: ['roleauto', 'joinrole'],
      category: 'module',
      cooldown: 30000,
      requirements: {
        userPermissions: ['MANAGE_GUILD'],
        requireDatabase: true,
        guildOnly: true,
      },
    }, [
      {
        type: 'role|string',
        require: true,
        whitelist(arg) {
          if (typeof arg === 'string') return ['--disable'];
          else return [];
        },
        clientHasHigh: true,
        authorHasHigh: true,
      },
    ]);
  }

  async run({ channel, guildData, author, t }, role) {
    if (role instanceof Role) {
      const oldRoleId = guildData.autoroleId;
      await guildData.setAutoRole(role.id, author.id);
      if (!oldRoleId) channel.send(t('commands:autorole.enabled', { role: role.name }));
      channel.send(t('commands:autor.changed', { role: role.name }));
    } // else {}

    // let msg;
    // if (!query && !guildData.autrole) {
    //   throw new CommandError('commands:autorole.requireRole', { onUsage: true });
    // } else if (!query && guildData.autrole) {
    //   msg = t('commands:autorole.disabled');
    // } else {
    //   const { name, id } = await RoleParameter.parse(query, {}, { guild });
    //   if (guildData.autorole === id) throw new CommandError('commands.autorole.isCurrentRole');

    //   if (!guildData.autrole) msg = t('commands:autorole.enabled', { role: name });
    //   else msg = t('commands:autor.changed', { role: name });

    //   role = id;
    // }

    // await database.guilds.edit(guild.id, {
    //   autorole: role,
    // });

    // await channel.send(msg);
  }
}

module.exports = AutoRole;
