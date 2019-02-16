const { Loggers } = require('../..')
const CommandError = require('./CommandError')

class Parameters {
  constructor (command) {
    this.command = command
    this.client = this.command.client
    this.parameters = this.command.parameters || []
  }

  handle (context) {
    let query = context.query
    let result = []
    for (let p in this.parameters) {
      const param = this.parameters[p]
      if (this.client.parameters.has(param.id.toLowerCase())) {
        const Parameter = this.client.parameters.get(param.id.toLowerCase())
        const ctx = new Parameter(param).handle(context, query)
        if (ctx instanceof CommandError) {
          result = ctx
          break
        } else {
          if (ctx.context) query = ctx.query
          result.push(ctx)
        }
      } else {
        Loggers.error(['COMMAND', 'PARAMETER'], 'Invalid Parameter!:', param.id)
      }
    }
    return result
  }
}

module.exports = Parameters
