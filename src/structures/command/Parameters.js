const { Loggers } = require('../..')
const CommandError = require('./CommandError')

class Parameters {
  constructor (command) {
    this.command = command
    this.client = this.command.client
    this.parameters = this.command.parameters || []
  }
  handle (message, args) {
    let context = message
    for (let param in this.parameters) {
      if (this.client.parameters.has(this.parameters[param].id.toLowerCase())) {
        let Parameter = this.client.parameters.get(this.parameters[param].id.toLowerCase())
        let ctx = new Parameter(this.parameters[param]).handle(context, args)
        if (ctx instanceof CommandError) {

        }
      } else {
        Loggers.error(['COMMAND', 'PARAMETER'], 'Invalid Parameter!:', param.id)
      }
    }
  }
}
module.exports = Parameters
