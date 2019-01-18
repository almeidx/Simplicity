const { Command } = require('../../')

class Reload extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['load']
    this.category = 'dev'
    this.requirements = { argsRequired: true }
  }
  run ({ message, args }) {
    try {
      delete require.cache[require.resolve(`./${args}.js`)]
    } catch (e) {
      return message.reply(`I could'nt find any command with the name **${args[0]}**!`)
    };
    message.reply(`The command **${args}** has been reloaded sucessfully!`)
  }
}
module.exports = Reload
