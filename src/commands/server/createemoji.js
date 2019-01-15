const { Command } = require('../..')

class CreateEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['createmoji', 'addemoji']
    this.category = 'server'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_EMOJIS'], clientPermissions: ['MANAGE_EMOJIS'] }
  }
  run ({ message, args }) {
    // this is just here as a reminder
  }
}

module.exports = CreateEmoji
