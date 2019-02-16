class CommandError extends Error {
  constructor (message, options) {
    super(message)
    this.options = options
  }
}
module.exports = CommandError
