const { Command } = require('../../')

class Reload extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['load']
    this.description = 'This command reloads another command.'
    this.usage = `Usage: **${process.env.PREFIX}reload [command]**`
    this.category = 'Developer'
    this.argsRequired = true
  }

  run (message, args) {
    try {
      delete require.cache[require.resolve(`./${args}.js`)]
    } catch (e) {
      return message.reply(`I could'nt find any command with the name **${args[0]}**!`)
    };
    message.reply(`The command **${args}** has been reloaded sucessfully!`)
  }
}

module.exports = Reload
