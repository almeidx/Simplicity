const { Command, Embed } = require('../../')

class Ping extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['pong']
    this.category = 'bot'
  }

  async run ({ message, send, t }) {
    const embed = new Embed({ message, t })
      .setDescription('commands:ping.loading')

    send(embed)
      .then(msg => {
        msg.edit(embed.setDescription('commands:ping.sucess', { HOST: msg.createdTimestamp - message.createdTimestamp, API: Math.round(this.client.ws.ping) }))
      })
  }
}
module.exports = Ping
