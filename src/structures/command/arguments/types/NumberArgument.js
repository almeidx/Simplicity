'use strict';

const CommandError = require('../../CommandError.js');
const Argument = require('./Argument.js');

const isNull = (n) => n === null || n === undefined || isNaN(n);

class NumberArgument extends Argument {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      forceMax: !!options.forceMax,
      forceMin: !!options.forceMin,
      max: Number(options.max),
      min: Number(options.min),
    };
  }

  static parse(arg, { t }) {
    if (!arg) return;

    let nmb = Number(arg.replace(/%/g, ''));
    if (isNull(nmb)) throw new CommandError(t('errors:invalidNumber'), this.showUsage);
    if (!isNull(this.min) && nmb < this.min) {
      if (!this.forceMin) throw new CommandError(t('errors:needBiggerNumber', { number: this.min }));
      nmb = this.min;
    }
    if (!isNull(this.max) && nmb > this.max) {
      if (!this.forceMax) throw new CommandError(t('errors:needSmallerNumber', { number: this.max }));
      nmb = this.max;
    }

    return nmb;
  }
}

module.exports = NumberArgument;
