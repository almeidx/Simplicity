class CommandError extends Error {
  constructor (messageError) {
    super()
    this.messageError = messageError
  }
}

module.exports = CommandError
