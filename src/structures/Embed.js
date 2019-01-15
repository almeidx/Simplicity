const { MessageEmbed } = require('discord.js')

class SimplicityEmbed extends MessageEmbed {
  constructor (data) {
    super(data)
    this.simpliData = this.data
  }
}

module.exports = SimplicityEmbed
