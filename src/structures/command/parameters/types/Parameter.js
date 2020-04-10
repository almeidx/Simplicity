'use strict';

const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k];

class Parameter {
  static parseOptions(options = {}) {
    return {
      aliases: options.aliases,
      full: !!options.full,
      fullJoin: options.fullJoin,
      missingError: options.missingError || 'errors:generic',
      name: options.name,
      required: defVal(options, 'required', true),
      showUsage: defVal(options, 'showUsage', true),
      whitelist: options.whitelist,
    };
  }

  static _parse(arg, options, context) {
    return this.parse.call(options, arg, context);
  }

  static parse(arg) {
    return arg;
  }
}

module.exports = Parameter;
