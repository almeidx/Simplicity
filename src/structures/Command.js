const Requirements = require('./command/Requirements')
const CommandError = require('./command/CommandError')
const { MessageEmbed } = require('discord.js')
class Command {
  constructor (client) {
    this.client = client
    this.name = 'none'
    this.category = 'none'
    this.usage = false
    this.aliases = []
    this.requirements = null
  }
  run () {}
  _run (context) {
    const requirements = new Requirements(this.requirements).handle(context)
    if (requirements instanceof CommandError) {
      const embed = new MessageEmbed()
        .setDescription(requirements.message)
      if (this.usage && context.t(`commands:${this.name}.usage`) !== `commands:${this.name}.usage`) {
        embed.addField('errors:usage', `${context.prefix + this.name} ${context.t(`commands:${this.name}.usage`)}`)
      }
      return context.send(embed, { error: true, description: requirements.options })
    }
    this.run(context)
  }
}

module.exports = Command
