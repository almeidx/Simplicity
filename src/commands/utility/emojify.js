const { Command } = require('../../')

class Emojify extends Command {
  constructor (client) {
    super(client)
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }
  run ({ send, args, t }) {
    var text = args.join(' ')
    let word = ''
    function getCharacter (input) {
      if (('abcdefghijklmnopqrstuvwxyz').includes(input)) {
        return `:regional_indicator_${input}:`
      } else if (input.match('(^[0-9]*$)')) {
        return [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'][input]
      } else {
        switch (input) {
          case '!': return ':grey_exclamation:'
          case '<': return ':arrow_backward:'
          case '>': return ':arrow_forward:'
          case ',': return ','
          case '.': return '.'
          case '@': return '@'
          default: return ' '
        }
      }
    }
    text.toLowerCase().split('').forEach(function (char) {
      word += (char ? getCharacter(char) : ' ')
    })
    if (word && word.length <= 2000) {
      send(word)
        .catch(() => {
          send(t('commands:emojify.invalidCharacters'))
        })
    } else {
      send(t('commands:emojify.messageTooBig'))
    }
  }
}
module.exports = Emojify
