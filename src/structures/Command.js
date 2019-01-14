const Requirements = require('./Requirements')
const CommandError = require('./CommandError')

class Command {
  constructor (client) {
    this.client = client
    this.name = 'none'
    this.category = 'none'
    this.aliases = []
    this.requirements = null
    this._requirements = new Requirements(this.requirements)
  }
  run () {}

  _run (context) {
    const requirements = this._requirements.handle(context)
    if (requirements instanceof CommandError) {
      return context.channel.send('faltou algo')
    }
    this.run(context)
  }
}

module.exports = Command
