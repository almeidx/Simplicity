const Parameters = require('./parameters')
const CommandError = require('./CommandError')

class CommandParameters {
  static handle (context, parameters, args) {
    return this._handle(context, parameters, args)
  }

  static _handle (context, parameters = [], args) {
    return parameters.map(async (p) => {
      const name = p.type && (p.type[0].toUpperCase() + p.type.slice(1))
      const Parameter = name && Parameters[name]

      if (!name || !Parameter) throw new Error('Invalid Parameter:', name)
      const parameter = new Parameter(p)
      const result = await parameter.handle(context, args)
      if (result) args.splice(0, 1)
      else {
        if (!parameter.required) return null
        else throw new CommandError(parameter.missingError)
      }
      return result
    })
  }
}

module.exports = CommandParameters
