'use strict';

const CommandError = require('@command/CommandError');
const { verifyDev } = require('@util/PermissionUtil');
const Parameter = require('./Parameter');

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/;
const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k];

class UserParameter extends Parameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      acceptBot: !!options.acceptBot,
      acceptDeveloper: defVal(options, 'acceptDeveloper', true),
      acceptSelf: !!options.acceptSelf,
      acceptUser: defVal(options, 'acceptUser', true),
      errors: {
        acceptBot: 'errors:invalidUserBot',
        acceptDeveloper: 'errors:userCantBeDeveloper',
        acceptSelf: 'errors:sameUser',
        acceptUser: 'errors:invalidUserNotBot',
        invalidUser: 'errors:invalidUser',
        ...options.errors || {},
      },
      fetchGlobal: !!options.fetchGlobal,
    };
  }

  static async parse(arg, { t, client, author, guild }) {
    if (!arg) return;

    const regexResult = MENTION_REGEX.exec(arg);
    const id = regexResult && regexResult[1];
    const findMember = guild.members.cache.find((m) =>
      m.user.username.toLowerCase().includes(arg.toLowerCase()) ||
      m.displayName.toLowerCase().includes(arg.toLowerCase()));

    let user = client.users.cache.get(id) || (!!findMember && findMember.user);
    if (!user && this.fetchGlobal) {
      user = await client.users.fetch(id).catch(() => null);
      if (user) user.isPartial = true;
    }

    if (!user && !this.moreParams) throw new CommandError(t(this.errors.invalidUser));
    if (!this.acceptSelf && user.id === author.id) throw new CommandError(t(this.errors.acceptSelf));
    if (!this.acceptBot && user.bot) throw new CommandError(t(this.errors.acceptBot));
    if (!this.acceptUser && !user.bot) throw new CommandError(t(this.errors.acceptUser));
    if (!this.acceptDeveloper && verifyDev(client, user)) throw new CommandError(t(this.errors.acceptDeveloper), false);

    return user;
  }
}

module.exports = UserParameter;
