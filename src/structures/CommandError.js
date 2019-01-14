class CommandError extends Error {
  constructor (messageError, options) {
    super()
    this.messageError = messageError
    this.options = options
  }
}

module.exports = CommandError
