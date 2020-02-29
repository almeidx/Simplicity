'use strict';

const { verifyDev } = require('@util/PermissionUtil');
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
    const options = CommandRequirements.parseOptions(requirements);
    if (options.requireDatabase && !client.database) throw new CommandError(ERROR_RESPONSES.requireDatabase);

    if (options.ownerOnly && !verifyDev(author.id, client)) throw new CommandError(ERROR_RESPONSES.ownerOnly);

    if (options.guildOnly && !guild) throw new CommandError(ERROR_RESPONSES.guildOnly);

    if (channel.type === 'text') {
      const clientPerms = options.clientPermissions.filter(p =>
        !channel.permissionsFor(guild.me).has(p)).map(p => t(`permissions:${p}`),
      );
      if (clientPerms.length !== 0) {
        throw new CommandError(t(ERROR_RESPONSES.clientPermissions, {
          count: clientPerms.length,
          onUsage: true,
          permissions: clientPerms.join(', '),
        }));
      }

      const memberPerms = options.permissions.filter(p =>
        !channel.permissionsFor(author.id).has(p)).map(p => t(`permissions:${p}`),
      );
      if (memberPerms.length !== 0) {
        throw new CommandError(t(ERROR_RESPONSES.userMissingPermission, {
          count: memberPerms.length,
          onUsage: true,
          permissions: memberPerms.join(', '),
        }));
      }
    }

    if (options.argsRequired && args.length === 0) {
      throw new CommandError(argResponse || ERROR_RESPONSES.argsRequired, { onUsage: true });
    }
  }
}

module.exports = CommandRequirements;
