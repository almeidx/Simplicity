const { Command, Embed } = require('../..')

class ServerIcon extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['svicon']
    this.category = 'server'
  }
  run ({ author, guild, send, t }) {
    const embed = new Embed({ author, t, guild })
      .setDescription('commands:servericon:text', { iconURL: guild.iconURL({ size: 2048 }) })
      .setImage(guild.iconURL({ size: 2048 }))
    send(embed)
  }
}
module.exports = ServerIcon
