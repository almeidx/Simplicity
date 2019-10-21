import {
  MessageTypes, TextChannel, DMChannel,
} from 'discord.js';
import { isDeveloper, notHavePermissions } from '../utils/Utils';
import { CommandRequirements } from '../base';

import CommandError from '../utils/CommandError';

export default function handleRequirements(
  requirements: CommandRequirements, message: MessageTypes,
): never | void {
  const {
    ownerOnly, requireDatabase, guildOnly, userPermissions, clientPermissions,
  } = requirements;

  const { author, client, channel } = message;
  if (ownerOnly && !isDeveloper(author.id, client)) {
    throw new CommandError('errors:developerOnly');
  }

  if (guildOnly && channel instanceof DMChannel) {
    throw new CommandError('errors:guildOnly');
  }

  if (requireDatabase && !client.databaseConnection) {
    throw new CommandError('errors:requireDatabase');
  }

  if (channel instanceof TextChannel) {
    const uPermissions = userPermissions && notHavePermissions(userPermissions, channel, author);
    if (uPermissions && uPermissions.length) {
      throw new CommandError('errors:userMissingPermission');
    }
    const cPermissions = clientPermissions && notHavePermissions(
      clientPermissions, channel, client.user,
    );
    if (cPermissions && cPermissions.length) {
      throw new CommandError('errors:clientMissingPermission');
    }
  }
}
