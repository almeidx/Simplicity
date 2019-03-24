const { CommandError } = require('../')

class Argument {
  static async parse (query, options = {}, dependencies = {}) {
    options = this.parseOptions(options)
    const result = await this.search(query, dependencies, options)

    if (!result && options.required) throw new CommandError(options.missingError)
    await this.verifyExceptions(result, dependencies, options)
    return result || null
  }

  static parseOptions (options = {}) {
    return Object.assign({
      required: false,
      missingError: 'errors:missingParameters'
    }, options)
  }

  static search () {
    return null
  }

  static verifyExceptions () {
    return true
  }
}

module.exports = Argument
