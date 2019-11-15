'use strict';

const Parameter = require('./Parameter');
const CommandError = require('@command/CommandError');

const MENTION_ROLE_REGEX = /^(?:<@&?)?([0-9]{16,18})(?:>)?$/;

class RoleParameter extends Parameter {
  static parse(arg, { t, guild }) {
    if (!arg) return;

    const regexResult = MENTION_ROLE_REGEX.exec(arg);
    const id = regexResult && regexResult[1];

    let role = guild.roles.get(id) || guild.roles.find((r) => r.name.toLowerCase() === arg.toLowerCase()) ||
      guild.roles.find((r) => r.name.toLowerCase().includes(arg.toLowerCase()));
    if (!role && !this.moreParams) throw new CommandError(t('errors:invalidRole'));
    return role;
  }
}

module.exports = RoleParameter;
