'use strict';

const CommandError = require('@command/CommandError');

class Argument {
  static async parse(query, options = {}, dependencies = {}) {
    options = this.setupOptions(options);
    const result = await this.search(query, dependencies, options);
    if (!result && options.required) throw new CommandError(options.errors.missingError);
    else await this.verifyExceptions(result, options, dependencies);
    return result || null;
  }

  static setupOptions(options = {}) {
    options = this.parseOptions(options);
    options.errors = this.parseMessageErrors(options);
    return options;
  }

  static parseOptions(options = {}) {
    return Object.assign({
      required: false,
    }, options);
  }

  static parseMessageErrors(options = {}) {
    return Object.assign({
      missingError: 'errors:missingParameters',
    }, options.errors);
  }

  static search() {
    return null;
  }

  static verifyExceptions() {
    return true;
  }
}

module.exports = Argument;
