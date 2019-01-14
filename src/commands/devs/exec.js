const exec = require('shell-exec')
const { Command } = require('../../')

class Exec extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['execute', 'run', 'npm']
    this.description = 'This command lets my developers execute bash codes.'
    this.usage = `Usage: **${process.env.PREFIX}exec [code]**`
    this.category = 'Developer'
    this.argsRequired = true
  }
  run (message, args) {
    function exe (execc, message) {
      exec(execc)
        .then(c => message.channel.send(JSON.stringify(c.stdout).replace(/\\n/g, '\n').slice(1, -1)))
        .catch(console.log)
    }
    exe(args.join(' '), message)
  }
}

module.exports = Exec
