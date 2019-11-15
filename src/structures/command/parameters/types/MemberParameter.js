'use strict';

const UserParameter = require('./UserParameter.js');

class MemberParameter extends UserParameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      fetchGlobal: false,
    };
  }

  static async parse(arg, context) {
    if (!arg) return;

    const { guild } = context;
    const user = await super.parse(arg, context);
    if (!user) return;
    return guild.member(user);
  }
}

module.exports = MemberParameter;
