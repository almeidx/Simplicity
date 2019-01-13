const { Command } = require('../../')

class Restart extends Command {
  constructor (client) {
    super(client)
    this.description = 'This command makes me restart.'
    this.usage = `Usage: **${process.env.PREFIX}restart**`
    this.category = 'Developer'
    this.argsRequired = false
  }
  run (message) {
    resetBot(message.channel)
    async function resetBot (channel) {
      channel.send('Restarting...')
        .then(m => {
          this.client.on('ready', () => {
            m.edit(`Sucessfully restarted the bot in ${message.createdTimestamp - m.createdTimestamp}ms.`)
            m.react('✅')
          })
        })
        .then(msg => this.client.destroy())
        .then(() => this.client.login(process.env.BOT_TOKEN))
    }
  }
}

module.exports = Restart
