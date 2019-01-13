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
    exec() // maybe later i'll finish this
  }
}

module.exports = Exec
