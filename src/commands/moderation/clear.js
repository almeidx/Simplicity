const { Command } = require('../../')

class Clear extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['purge', 'prune', 'clean']
    this.description = 'This command clears messages from the chat.'
    this.usage = `Usage: **${process.env.PREFIX}clear [amount]**`
    this.category = 'Moderation'
    this.argsRequired = true
    this.permissions = ['MANAGE_MESSAGES']
    this.clientPermissions = ['MANAGE_MESSAGES']
  }

  async run (message, [amount]) {
    let total = parseInt(amount, 10)
    if (!total || total <= 2 || total >= 100) {
      return message.reply('Por favor, indique entre 2 a 100 mensagens!')
    };
    const res = await message.channel.messages.fetch({ limit: total })
    message.channel.bulkDelete(res)
      .catch(() => {
        return message.reply('An error has ocurred while trying to delete the messages.')
      })
    message.channel.send(`${res.size} messages have been deleted by ${message.author}. `)
      .catch(err => console.log(err))
  }
}

module.exports = Clear
