'use strict';

const Argument = require('./Argument.js');

class BooleanFlagArgument extends Argument {
  static parse() {
    return true;
  }
}

module.exports = BooleanFlagArgument;
