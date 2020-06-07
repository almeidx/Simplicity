import { User } from 'discord.js';
import CommandError from '../../CommandError';
import Argument from './Argument';
import { UserArgOptions, ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';
import PermissionUtil from '../../../../util/PermissionUtil';

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/;

export default class UserArgument extends Argument<User, UserArgOptions> {
  parseOptions(options: Partial<UserArgOptions> = {}): UserArgOptions & ParameterOptions {
    return {
      ...super.parseOptions(options),
      acceptBot: options.acceptBot || true,
      acceptDeveloper: options.acceptDeveloper || true,
      acceptSelf: options.acceptSelf || true,
      acceptUser: options.acceptUser || true,
      fetchGlobal: options.fetchGlobal || true,
    };
  }

  async parse(
    opts: UserArgOptions & ParameterOptions, arg: string, {
      author, client, guild,
    }: CommandContext,
  ): Promise<User | null> {
    if (!arg) return null;

    const regexResult = MENTION_REGEX.exec(arg);
    const id = regexResult && regexResult[1];
    const findMember = guild.members.cache
      .find((m) => m.user.username.toLowerCase().includes(arg.toLowerCase())
      || m.displayName.toLowerCase().includes(arg.toLowerCase()));

    let user = (id && (client.users.cache.get(id) || (!!findMember && findMember.user))) || null;
    if (!user && opts.fetchGlobal) {
      user = (id && await client.users.fetch(id).catch(() => null)) || null;
      if (user) user.isPartial = true;
    }

    if (!opts.acceptSelf && user && user.id === author.id) throw new CommandError('errors:sameUser');
    if (!opts.acceptBot && user && user.bot) throw new CommandError('errors:invalidUserBot');
    if (!opts.acceptUser && user && !user.bot) throw new CommandError('errors:invalidUserNotBot');
    if (!opts.acceptDeveloper && user && PermissionUtil.verifyDev(user.id, client)) {
      throw new CommandError('errors:userCantBeDeveloper');
    }

    return user;
  }
}
