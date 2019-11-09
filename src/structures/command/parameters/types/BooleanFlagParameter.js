'use strict';

const Parameter = require('./Parameter.js');

class BooleanFlagParameter extends Parameter {
  static parse() {
    return true;
  }
}

module.exports = BooleanFlagParameter;
