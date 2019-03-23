class CommandError extends Error {
  constructor (message, options = {}) {
    super(message)
    this.options = options
    this.onUsage = !!options.onUsage
  }
}

module.exports = CommandError
