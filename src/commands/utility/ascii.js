const { Command } = require('../../')
const request = require('request')

class Ascii extends Command {
  constructor (client) {
    super(client)
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }
  run ({ send, args, t }) {
    if (args.length > 15) {
      return send('Porra vsf man')
    }
    send(`Loading`)
    request('https://artii.herokuapp.com/make?text=' + args.join(' '), function (error, response, body) {
      if (!error && response.statusCode === 200) {
        send(`\`\`\`${body}\`\`\``)
      } else {
        send(t('errors:general'))
      }
    })
  }
}
module.exports = Ascii
