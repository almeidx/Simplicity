const { Command } = require('../../')
const exec = require('shell-exec')

class Exec extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['execute', 'run', 'npm']
    this.category = 'dev'
    this.requirements = { argsRequired: true, ownerOnly: true }
  }
  run ({ send, query }) {
    exec(query)
      .then(c => {
        send(JSON.stringify(c.stdout).replace(/\\n/g, '\n').slice(1, -1))
      })
      .catch(console.log)
  }
}
module.exports = Exec
