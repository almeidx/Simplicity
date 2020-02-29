'use strict';

const { URL } = require('url');
const CommandError = require('../../CommandError.js');
const Parameter = require('./Parameter.js');

class URLParameter extends Parameter {
  static parse(arg, { t }) {
    if (!arg) return;

    try {
      return new URL(arg);
    } catch (e) {
      throw new CommandError(t('errors:invalidURL'));
    }
  }
}

module.exports = URLParameter;
