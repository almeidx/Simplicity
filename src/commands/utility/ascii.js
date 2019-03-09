const { Command, CommandError } = require('../../')
const request = require('request')

class Ascii extends Command {
  constructor (client) {
    super(client)
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }

  run ({ send, query, t }) {
    if (query > 15) throw new CommandError('commands:ascii.queryTooBig', { amount: 15, onUsage: false })

    request(`https://artii.herokuapp.com/make?text=${query}`, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        return send(`\`\`\`${body}\`\`\``)
      } else {
        throw new CommandError('commands:ascii.error', { onUsage: false })
      }
    })
  }
}

module.exports = Ascii
