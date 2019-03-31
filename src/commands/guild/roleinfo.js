const { Command, Embed } = require('../..')
const moment = require('moment')

class RoleInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ri', 'roleinformation']
    this.category = 'guild'
    this.requirements = { argsRequired: true }
    this.WIP = true
  }
  
  run ({ author, guild, send, t }) {
    const embed = new Embed({ author, t })
    
  }
}

module.exports = RoleInfo
