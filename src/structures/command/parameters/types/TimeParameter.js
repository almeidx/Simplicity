'use strict';

const ms = require('ms');
const CommandError = require('../../CommandError');
const Parameter = require('./Parameter');

class TimeParameter extends Parameter {
  static parse(arg, { t }) {
    if (!arg) return;

    const result = ms(arg);
    if (!result) throw new CommandError(t('errors:invalidTime'));
    return result;
  }
}

module.exports = TimeParameter;
