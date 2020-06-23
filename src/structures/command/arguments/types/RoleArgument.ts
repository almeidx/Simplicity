import { Role } from 'discord.js';
import CommandError from '../../CommandError';
import Argument from './Argument';
import { RoleArgOptions, ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';

export default class RoleArgument extends Argument<Role, RoleArgOptions> {
  parseOptions(
    options: Partial<RoleArgOptions> = {},
  ):Required<RoleArgOptions & ParameterOptions> {
    return {
      ...super.parseOptions(options),
      acceptEveryone: false,
      authorNeedsHigherRole: true,
      botNeedsHigherRole: true,
      ...options,
    };
  }

  parse(
    opts: Required<RoleArgOptions & ParameterOptions>,
    arg: string, { guild, member, t }: CommandContext,
  ): Role | null {
    if (!arg) return null;

    const input = arg.toLowerCase();
    const MENTION_ROLE_REGEX = /^(?:<@&?)?([0-9]{16,18})(?:>)?$/;
    const regexResult = MENTION_ROLE_REGEX.exec(arg);
    const id = regexResult && regexResult[1];

    const role = ((id && guild.roles.cache.get(id))
      || guild.roles.cache.find((r) => r.name.toLowerCase() === input)
      || guild.roles.cache.find((r) => r.name.toLowerCase().includes(input))
    ) || null;

    if (!opts.acceptEveryone && role && role.id === guild.id) {
      throw new CommandError(t('errors:roleIsEveryone'));
    }

    if (role) {
      if (
        opts.botNeedsHigherRole
        && (role.position > (guild?.me?.roles.highest.position as number))
      ) {
        throw new CommandError(t('errors:botNeedsHigherRole', { role: `${role}` }));
      }
      if (
        opts.authorNeedsHigherRole
        && (role.position > member.roles.highest.position)
      ) {
        throw new CommandError(t('errors:authorNeedsHigherRole', { role: `${role}` }));
      }
    }

    return role;
  }
}
