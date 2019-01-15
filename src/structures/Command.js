const Requirements = require('./Requirements')
const CommandError = require('./CommandError')

class Command {
  constructor (client) {
    this.client = client
    this.name = 'none'
    this.category = 'none'
    this.aliases = []
    this.requirements = null
  }
  run () {}
  _run (context) {
    const requirements = new Requirements(this.requirements).handle(context)
    if (requirements instanceof CommandError) {
      return context.channel.send(context.t(requirements.message, requirements.options))
    }
    this.run(context)
  }
}

module.exports = Command
