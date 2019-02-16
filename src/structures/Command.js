const Requirements = require('./command/Requirements')
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

  async run () {}

  async _run (context) {
    const requirements = new Requirements(this.requirements)
    try {
      await requirements.handle(context)
      await this.run(context)
    } catch (e) {
      return this.sendError(context, e)
    }
  }

  sendError (context, error) {
    const embed = new MessageEmbed()
      .setDescription(error.message)
    if (this.usage && context.t(`commands:${this.name}.usage`) !== `${this.name}.usage`) {
      embed.addField('errors:usage', `${context.prefix + this.name} ${context.t(`commands:${this.name}.usage`)}`)
    }
    return context.send(embed, { error: true, options: error.options })
  }
}

module.exports = Command
