const { Command, SimplicityEmbed } = require('../../')
const { exec } = require('child_process')
const clean = (str) => str.toString().slice(0, 1020) + str.toString().length >= 1024 ? '...' : str.toString()

class Exec extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'execute', 'run' ]
    this.category = 'dev'
    this.requirements = {
      argsRequired: true,
      ownerOnly: true }
  }

  run ({ author, emoji, query, send, t }) {
    const embed = new SimplicityEmbed({ author, emoji, t }, { autoAuthor: false })

    exec(query, (error, stdout) => {
      if (error) {
        embed
          .setTitle('common:general')
          .setDescription(clean(error))
          .setError()
        return send(embed)
      } else {
        embed
          .setTitle('» $$commands:exec.result')
          .setDescription(clean(stdout))
        return send(embed)
      }
    })
  }
}

module.exports = Exec
