class CommandError extends Error {
  constructor (message, options = {}) {
    super(message)
    options = Object.assign({ onUsage: false }, options)
    this.options = options
    this.onUsage = options.onUsage
  }
}

module.exports = CommandError
