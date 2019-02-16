class Parameter {
  constructor (options, query) {
    options = options.assign({ required: true }, options)
    this.required = !options.require
    this.query = query
  }

  handle () {}
}

module.exports = Parameter
