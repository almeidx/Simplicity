const { Command } = require('../../')

class Restart extends Command {
  constructor (client) {
    super(client)
    this.category = 'dev'
    this.requirements = { ownerOnly: true }
  }
  run ({ message, client, channel }) {
    channel.send('Restarting...')
      .then(m => {
        client.on('ready', () => {
          m.edit(`Sucessfully restarted the bot in ${message.createdTimestamp - m.createdTimestamp}ms.`)
          m.react('✅')
        })
      })
      .then(() => client.destroy())
      .then(() => client.login(process.env.BOT_TOKEN))
  }
}
module.exports = Restart
