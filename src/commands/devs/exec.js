const exec = require('shell-exec')
const { Command } = require('../../')

class Exec extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['execute', 'run', 'npm']
    this.category = 'dev'
    this.requirements = { argsRequired: true, ownerOnly: true }
  }
  run ({ message, args }) {
    function exe (execc, message) {
      exec(execc)
        .then(c => message.channel.send(JSON.stringify(c.stdout).replace(/\\n/g, '\n').slice(1, -1)))
        .catch(console.log)
    }
    exe(args.join(' '), message)
  }
}

module.exports = Exec
