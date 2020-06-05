import { TextChannel, PermissionString } from 'discord.js';
import { PermissionUtil, Util } from '../../util';
import CommandError from './CommandError';
import CommandContext from './CommandContext';

enum ERROR_RESPONSES {
  clientPermissions = 'errors:clientMissingPermission',
  guildOnly = 'errors:guildOnly',
  ownerOnly = 'errors:developerOnly',
  requireDatabase = 'errors:requireDatabase',
  userMissingPermission = 'errors:userMissingPermission',
};

export interface CommandRequirementOpts {
  clientPermissions: PermissionString[];
  guildOnly: boolean;
  ownerOnly: boolean;
  userPermissions: PermissionString[];
  requireDatabase: boolean;
}

export default class CommandRequirements {
  static parseOptions(options: Partial<CommandRequirementOpts>): CommandRequirementOpts {
    return {
      clientPermissions: [],
      guildOnly: true,
      ownerOnly: false,
      userPermissions: [],
      requireDatabase: false,
      ...options,
    };
  }

  static handle({
    author, client, channel, guild, t,
  }: CommandContext, opts: CommandRequirementOpts): void {
    const {
      clientPermissions,
      guildOnly,
      ownerOnly,
      userPermissions,
      requireDatabase,
    } = opts;

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
      const clientPerms = clientPermissions.filter((p) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        !channel.permissionsFor(String(guild.me?.id))?.has(p));
      if (!Util.isEmpty(clientPerms)) {
        throw new CommandError(t(ERROR_RESPONSES.clientPermissions, {
          count: clientPerms.length,
          onUsage: true,
          permissions: PermissionUtil.normalize(clientPerms, t).join(', '),
        }));
      }

      const memberPerms = userPermissions.filter((p) => !channel.permissionsFor(author.id)?.has(p));
      if (!Util.isEmpty(memberPerms)) {
        throw new CommandError(t(ERROR_RESPONSES.userMissingPermission, {
          count: memberPerms.length,
          onUsage: true,
          permissions: PermissionUtil.normalize(memberPerms, t).join(', '),
        }));
      }
    }
  }
}
