const Parameter = require('./Parameter')
const CommandError = require('../CommandError')

class StringParameter extends Parameter {
  constructor (options) {
    super(options)
    this.maxLength = Number(options.maxLength) || Infinity
    this.minLength = Number(options.maxLength) || 0
    this.default = null
  }

  handle ({ t }, args) {
    const query = this.default && args.length === 0 ? t(this.default) : args.join(' ')
    if (this.minLength !== 0 && query.length >= this.minLength) throw new CommandError('errors:minLength', { count: this.minLength })
    if (this.maxLength !== Infinity && query.length < this.maxLength) throw new CommandError('errors:maxLength', { count: this.maxLength })
    return query
  }
}

module.exports = StringParameter
