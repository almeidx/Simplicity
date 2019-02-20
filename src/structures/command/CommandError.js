class CommandError extends Error {
  constructor (message, options = {}) {
    super(message)
    options = Object.assign({ usage: true }, options)
    this.options = options
    this.usage = options.usage
  }
}
module.exports = CommandError
