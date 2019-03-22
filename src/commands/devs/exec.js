const { Command, Embed } = require('../../')
const { exec } = require('child_process')
const clean = (str) => typeof str === 'string' ? str.slice(0, 1020) + str.length >= 1024 ? '...' : str : str.toString().slice(0, 1020) + str.toString().length >= 1024 ? '...' : str.toString()

class Exec extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['execute', 'run']
    this.category = 'dev'
    this.requirements = { argsRequired: true, ownerOnly: true }
  }

  async run ({ author, emoji, send, query, t }) {
    const embed = new Embed({ author, emoji, t })
      .setDescription('utils:loading', { emoji: 'LOADING_EMOJI' })

    const msg = await send(embed)

    exec(query, (error, stdout) => {
      if (error) {
        embed
          .setDescription(clean(error))
          .setError()
        return msg.edit(embed)
      } else {
        embed
          .setDescription(clean(stdout))
        return msg.edit(embed)
      }
    })
  }
}

module.exports = Exec
