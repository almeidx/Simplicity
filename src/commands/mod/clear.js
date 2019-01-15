const { Command } = require('../../')

class Clear extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['purge', 'prune', 'clean']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_MESSAGES'], clientPermissions: ['MANAGE_MESSAGES'] }
  }
  async run ({ message, args }) {
    let amount = [args]
    let total = parseInt(amount)
    if (!total || total <= 2 || total >= 100) {
      return message.reply('Please, give a value between 2 and 100!')
    };
    const res = await message.channel.messages.fetch({ limit: amount })
    await message.channel.bulkDelete(res)
      .catch(() => {
        return message.reply('An error has ocurred while trying to delete the messages.')
      })
    message.channel.send(`${res.size} messages have been deleted by ${message.author}. `)
      .then(m => m.delete(15000))
      .catch(err => console.log(err))
  }
}

module.exports = Clear
