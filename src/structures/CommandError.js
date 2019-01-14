class CommandError extends Error {
  constructor (messageError, options) {
    super(messageError)
    this.messageError = messageError
    this.options = options
  }
}

module.exports = CommandError
