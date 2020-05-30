'use strict';

const { Util } = require('discord.js');
const CommandError = require('../../CommandError.js');
const Argument = require('./Argument.js');

class StringArgument extends Argument {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      clean: !!options.clean,
      errorRegex: options.regex,
      maxLength: Number(options.maxLength) || 0,
      truncate: !!options.truncate,
    };
  }

  static parse(arg, { t, message }) {
    arg = arg ? typeof arg === 'string' ? arg : String(arg) : null;
    if (!arg) return;

    if (this.clean) arg = Util.cleanContent(arg, message);

    if (this.maxLength > 0 && arg.length > this.maxLength) {
      if (!this.truncate) throw new CommandError(t('errors:needSmallerString', { number: this.maxLength }));
      arg = arg.substring(0, this.maxLength);
    }

    if (this.errorRegex && this.errorRegex.test(arg)) throw new CommandError(this.errors.regex);
    return arg;
  }
}

module.exports = StringArgument;
