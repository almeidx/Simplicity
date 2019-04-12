const { Command, SimplicityEmbed, Utils } = require('../..')

class ServerIcon extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'svicon', 'sicon' ]
    this.category = 'guild'
  }

  run ({ author, guild, send, t }) {
    const guildIconURL = Utils.getServerIconURL(guild)

    const embed = new SimplicityEmbed({ author, t })
      .setDescription('commands:servericon:text', { guildIconURL })
      .setImage(guildIconURL)

    return send(embed)
  }
}

module.exports = ServerIcon
