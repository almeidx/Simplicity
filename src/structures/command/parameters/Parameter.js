class Parameter {
  constructor (options = {}) {
    options = Object.assign({ required: true, missingError: 'errors:missingParameters' }, options)
    this.required = !!options.required
    this.missingError = options.missingError
  }

  handle () {}
}

module.exports = Parameter
