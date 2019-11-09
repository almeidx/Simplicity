'use strict';

const CommandError = require('@command/CommandError');
const Parameter = require('@structures/Parameter');

const MENTION_REGEX = /^(?:<@&?)?([0-9]{16,18})(?:>)?$/;

class RoleParameter extends Parameter {
  static parseOptions(options) {
    return Object.assign({
      ...super.parseOptions(options),
      canBeBotRole: true,
      canBeHigher: true,
      canBeLower: true,
      checkStartsWith: true,
      checkEndsWith: true,
    }, options);
  }

  static parseMessageErrors(options = {}) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      canBeBotRole: 'errors:canBeBotRole',
      canBeHigher: 'errors:',
      canBeLower: 'errors:',
    }, options.errors);
  }

  static verifyExceptions(role, exceptions = {}, { guild }) {
    exceptions = this.setupOptions(exceptions);

    const higherRole = guild.me.roles.highest.position > role.position;
    const lowerRole = guild.me.roles.highest.position > role.position;

    if (!exceptions.canBeBotRole && !role.editable && higherRole) throw new CommandError(
      exceptions.errors.canBeBotRole, { onUsage: true }
    );
    if (!exceptions.canBeHigher && higherRole) throw new CommandError(exceptions.errors.canBeHigher, { onUsage: true });
    if (!exceptions.canBeLower && lowerRole) throw new CommandError(exceptions.errors.canBeLower, { onUsage: true });

    return role;
  }

  static search(query, { guild }, options) {
    options = this.setupOptions(options);
    if (!query || typeof query !== 'string' || !guild) return;
    const regexResult = MENTION_REGEX.exec(query);
    const id = regexResult && regexResult[1];
    const getID = id && guild.roles && guild.roles.get(id);
    const findName = guild.roles.find((r) => r.name.toLowerCase() === query.toLowerCase());
    const findStartsName = options.checkStartsWith &&
      guild.roles.find((r) => r.name.toLowerCase().startsWith(query.toLowerCase()));
    const findEndsName = options.checkEndsWith &&
      guild.roles.find((r) => r.name.toLowerCase().endsWith(query.toLowerCase()));

    return getID || findName || findStartsName || findEndsName || null;
  }
}

module.exports = RoleParameter;
