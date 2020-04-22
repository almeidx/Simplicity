'use strict';

const CommandError = require('@command/CommandError');
const Parameter = require('./Parameter');

const MENTION_ROLE_REGEX = /^(?:<@&?)?([0-9]{16,18})(?:>)?$/;

class RoleParameter extends Parameter {
  static parseOptions(options) {
    return {
      ...super.parseOptions(options),
      authorHasHigh: !!options.authorHasHigh,
      clientHasHigh: !!options.clientHasHigh,
    };
  }

  static parse(arg, { t, guild, member }) {
    if (!arg) return;

    const regexResult = MENTION_ROLE_REGEX.exec(arg);
    const id = regexResult && regexResult[1];

    const role = guild.roles.cache.get(id) ||
      guild.roles.cache.find((r) => r.name.toLowerCase() === arg.toLowerCase()) ||
      guild.roles.cache.find((r) => r.name.toLowerCase().includes(arg.toLowerCase()));

    if (!role && !this.moreParams) throw new CommandError(t('errors:invalidRole'));
    if (this.clientHasHigh && role && (role.position > guild.me.roles.highest.position)) {
      throw new CommandError(t('errors:clientHasHigh', { role: `${role}` }));
    }
    if (this.authorHasHigh && role && (role.position > member.roles.highest.position)) {
      throw new CommandError(t('errors:authorHasHigh', { role: `${role}` }));
    }
    return role;
  }
}

module.exports = RoleParameter;
