'use strict';

const CommandError = require('./CommandError');
const PermissionsUtils = require('../../utils/PermissionsUtils');

class Requirements {
  constructor(requirements = {}, responses = {}) {
    requirements = Object.assign({
      argsRequired: false,
      nsfwChannelOnly: false,
      ownerOnly: false,
      guildOnly: true,
      requireDatabase: false,
      permissions: [],
      clientPermissions: [],
    }, requirements);

    this.argsRequired = requirements.argsRequired;
    this.nsfwChannelOnly = requirements.nsfwChannelOnly;
    this.ownerOnly = requirements.ownerOnly;
    this.clientPermissions = requirements.clientPermissions;
    this.permissions = requirements.permissions;
    this.guildOnly = requirements.guildOnly;
    this.requireDatabase = requirements.requireDatabase;

    this.responses = Object.assign({
      requireDatabase: 'errors:requireDatabase',
      guildOnly: 'errors:guildOnly',
      ownerOnly: 'errors:developerOnly',
      clientPermissions: 'errors:clientMissingPermission',
      userMissingPermission: 'errors:userMissingPermission',
      argsRequired: 'errors:missingParameters',
      nsfwChannelOnly: 'errors:nsfwChannel',
    }, responses);
  }

  handle({ author, client, channel, guild, args, t }) {
    if (this.requireDatabase && !client.database) throw new CommandError(this.responses.requireDatabase);

    if (this.ownerOnly && !PermissionsUtils.verifyDev(author.id, client)) throw new CommandError(
      this.responses.ownerOnly
    );

    if (this.guildOnly && !guild) throw new CommandError(this.responses.guildOnly);

    const clientPerms = this.clientPermissions.filter((p) =>
      !channel.permissionsFor(guild.me).has(p)).map((p) => t(`permissions:${p}`)
    );
    if (clientPerms.length !== 0) throw new CommandError(t(this.responses.clientPermissions, {
      permissions: clientPerms.join(', '),
      count: clientPerms.length,
      onUsage: true }));

    const memberPerms = this.permissions.filter((p) =>
      !channel.permissionsFor(author.id).has(p)).map((p) => t(`permissions:${p}`)
    );
    if (memberPerms.length !== 0) throw new CommandError(t(this.responses.userMissingPermission, {
      permissions: memberPerms.join(', '),
      count: memberPerms.length,
      onUsage: true,
    }));

    if (this.argsRequired && args.length === 0) throw new CommandError(this.responses.argsRequired, { onUsage: true });

    if (this.nsfwChannelOnly && !channel.nsfw) throw new CommandError(
      this.responses.nsfwChannelOnly, { onUsage: true }
    );
  }
}

module.exports = Requirements;
