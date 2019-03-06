const { Command, Embed } = require('../../')
const request = require('request')

class Ascii extends Command {
  constructor (client) {
    super(client)
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }

  run ({ send, query, t }) {
    const embed = new Embed({ t })

    if (query > 15) {
      embed.setDescription('commands:ascii.queryTooBig')
        .setError()

      return send(embed)
    }

    request(`https://artii.herokuapp.com/make?text=${query}`, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        return send(`\`\`\`${body}\`\`\``)
      } else {
        embed.setDescription('errors:general')
          .setError()

        return send(embed)
      }
    })
  }
}

module.exports = Ascii
