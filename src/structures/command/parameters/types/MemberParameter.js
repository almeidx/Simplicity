'use strict';

const UserParameter = require('./UserParameter.js');

class MemberParameter extends UserParameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      fetchGlobal: false,
    };
  }

  static parse(arg, context) {
    if (!arg) return;

    const { guild } = context;
    const user = super.parse(arg, context);
    return guild.member(user);
  }
}

module.exports = MemberParameter;
