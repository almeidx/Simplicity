'use strict';

const PermissionUtil = require('@util/PermissionUtil');
const { isEmpty } = require('@util/Util');
const { TextChannel } = require('discord.js');
const CommandError = require('./CommandError');

const ERROR_RESPONSES = {
  argsRequired: 'errors:missingParameters',
  clientPermissions: 'errors:clientMissingPermission',
  guildOnly: 'errors:guildOnly',
  ownerOnly: 'errors:developerOnly',
  requireDatabase: 'errors:requireDatabase',
  userMissingPermission: 'errors:userMissingPermission',
};

class CommandRequirements {
  static parseOptions(options) {
    return Object.assign({
      argsRequired: false,
      clientPermissions: [],
      guildOnly: true,
      nsfwChannelOnly: false,
      ownerOnly: false,
      permissions: [],
      requireDatabase: false,
    }, options);
  }

  static handle({ author, client, channel, guild, args, t }, requirements, argResponse) {
    const {
      argsRequired,
      clientPermissions,
      guildOnly,
      ownerOnly,
      permissions,
      requireDatabase,
    } = CommandRequirements.parseOptions(requirements);

    if (requireDatabase && !client.database) {
      throw new CommandError(ERROR_RESPONSES.requireDatabase);
    }

    if (ownerOnly && !PermissionUtil.verifyDev(author.id, client)) {
      throw new CommandError(ERROR_RESPONSES.ownerOnly);
    }

    if (guildOnly && !guild) {
      throw new CommandError(ERROR_RESPONSES.guildOnly);
    }

    if (channel instanceof TextChannel) {
      const clientPerms = clientPermissions.filter((p) => !channel.permissionsFor(guild.me).has(p));
      if (!isEmpty(clientPerms)) {
        throw new CommandError(t(ERROR_RESPONSES.clientPermissions, {
          count: clientPerms.length,
          onUsage: true,
          permissions: PermissionUtil.normalize(clientPerms).join(', '),
        }));
      }

      const memberPerms = permissions.filter((p) => !channel.permissionsFor(author.id).has(p));
      if (!isEmpty(memberPerms)) {
        throw new CommandError(t(ERROR_RESPONSES.userMissingPermission, {
          count: memberPerms.length,
          onUsage: true,
          permissions: PermissionUtil.normalize(memberPerms).join(', '),
        }));
      }
    }

    if (argsRequired && isEmpty(args)) {
      throw new CommandError(argResponse || ERROR_RESPONSES.argsRequired, { onUsage: true });
    }
  }
}

module.exports = CommandRequirements;
