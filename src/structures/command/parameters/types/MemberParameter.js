'use strict';

const CommandError = require('@command/CommandError');
const UserParameter = require('./UserParameter');

class MemberParameter extends UserParameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      authorHasHigh: !!options.authorHasHigh,
      clientHasHigh: !!options.clientHasHigh,
      fetchGlobal: false,
    };
  }

  static async parse(arg, context) {
    if (!arg) return;

    const { author, guild, member: guildMember } = context;
    const user = await super.parse(arg, context);
    if (!user) return;

    const member = guild.member(user);

    const highestPosition = member.roles.highest.position;
    const notIsAuthor = author.id !== user.id;
    if (this.authorHasHigh && notIsAuthor && highestPosition >= guildMember.roles.highest.position) {
      throw new CommandError('errors:authorLowerRole');
    } else if (this.clientHasHigh && notIsAuthor && highestPosition >= guild.me.roles.highest.position) {
      throw new CommandError('errors:clientLowerRole');
    }

    return member;
  }
}

module.exports = MemberParameter;
