'use strict';

const { URL } = require('url');
const CommandError = require('../../CommandError.js');
const Argument = require('./Argument.js');

class URLArgument extends Argument {
  static parse(arg, { t }) {
    if (!arg) return;

    try {
      return new URL(arg);
    } catch (e) {
      throw new CommandError(t('errors:invalidURL'));
    }
  }
}

module.exports = URLArgument;
