const { Command, Embed } = require('../..')
const getServerIconURL = (g) => {
  if (g.iconURL()) return g.iconURL({ format: 'png', size: 2048 })
  else return `https://guild-default-icon.herokuapp.com/${g.nameAcronym}`
}

class ServerIcon extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['svicon']
    this.category = 'guild'
  }

  run ({ author, guild, send, t }) {
    const guildIconURL = getServerIconURL(guild)

    const embed = new Embed({ author, t })
      .setDescription('commands:servericon:text', { guildIconURL })
      .setImage(guildIconURL)

    send(embed)
  }
}

module.exports = ServerIcon
