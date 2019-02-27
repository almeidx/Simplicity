class CommandError extends Error {
  constructor (message, options = {}) {
    super(message)
    options = Object.assign({ onUsage: true }, options)
    this.options = options
    this.onUsage = options.onUsage
  }
}
module.exports = CommandError
