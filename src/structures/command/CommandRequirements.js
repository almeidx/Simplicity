'use strict';

const CommandError = require('./CommandError');
const { verifyDev } = require('@utils/PermissionUtils');

const ERROR_RESPONSES = {
  requireDatabase: 'errors:requireDatabase',
  guildOnly: 'errors:guildOnly',
  ownerOnly: 'errors:developerOnly',
  clientPermissions: 'errors:clientMissingPermission',
  userMissingPermission: 'errors:userMissingPermission',
  argsRequired: 'errors:missingParameters',
};

class CommandRequirements {
  static parseOptions(options) {
    return Object.assign({
      argsRequired: false,
      nsfwChannelOnly: false,
      ownerOnly: false,
      guildOnly: true,
      requireDatabase: false,
      permissions: [],
      clientPermissions: [],
    }, options);
  }

  static handle({ author, client, channel, guild, args, t }, requirements, argResponse) {
    const options = CommandRequirements.parseOptions(requirements);
    if (options.requireDatabase && !client.database) throw new CommandError(ERROR_RESPONSES.requireDatabase);

    if (options.ownerOnly && !verifyDev(author.id, client)) throw new CommandError(ERROR_RESPONSES.ownerOnly);

    if (options.guildOnly && !guild) throw new CommandError(ERROR_RESPONSES.guildOnly);

    if (channel.type === 'text') {
      const clientPerms = options.clientPermissions.filter((p) =>
        !channel.permissionsFor(guild.me).has(p)).map((p) => t(`permissions:${p}`)
      );
      if (clientPerms.length !== 0) throw new CommandError(t(ERROR_RESPONSES.clientPermissions, {
        permissions: clientPerms.join(', '),
        count: clientPerms.length,
        onUsage: true }));

      const memberPerms = options.permissions.filter((p) =>
        !channel.permissionsFor(author.id).has(p)).map((p) => t(`permissions:${p}`)
      );
      if (memberPerms.length !== 0) throw new CommandError(t(ERROR_RESPONSES.userMissingPermission, {
        permissions: memberPerms.join(', '),
        count: memberPerms.length,
        onUsage: true,
      }));
    }

    if (options.argsRequired && args.length === 0) {
      throw new CommandError(argResponse || ERROR_RESPONSES.argsRequired, { onUsage: true });
    }
  }
}

module.exports = CommandRequirements;
