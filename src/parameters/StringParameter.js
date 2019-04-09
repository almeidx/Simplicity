const Parameter = require('../structures/Parameter')
const CommandError = require('../structures/command/CommandError')

class StringParameter extends Parameter {
  static parseOptions (options) {
    return Object.assign({
      ...super.parseOptions(options),
      maxLength: Infinity,
      minLength: 0,
      defaultString: null,
      regex: null
    }, options)
  }

  static parseMessageErrors (options) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      maxLength: 'errors:maxLength',
      minLength: 'errors:minLength',
      regex: 'errors:missingParameter'
    }, options.errors)
  }

  static verifyExceptions (str, options = {}) {
    options = this.setupOptions(options)
    if (str.length > options.maxLength) throw new CommandError(options.errors.maxLength)
    if (str.length < options.minlength) throw new CommandError(options.errors.minLength)
    if (options.regex && options.regex.test(str)) throw new CommandError(options.errors.regex)
  }

  static search (str, _, options = {}) {
    options = this.setupOptions(options)
    return str || options.defaultString
  }
}

module.exports = StringParameter
