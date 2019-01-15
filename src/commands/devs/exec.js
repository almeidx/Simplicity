const exec = require('shell-exec')
const { Command } = require('../../')

class Exec extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['execute', 'run', 'npm']
    this.category = 'dev'
    this.requirements = { argsRequired: true, ownerOnly: true }
  }
  run ({ message, query }) {
      exec(query)
        .then(c => message.channel.send(JSON.stringify(c.stdout).replace(/\\n/g, '\n').slice(1, -1)))
        .catch(console.log)
    }
  }
}

module.exports = Exec
