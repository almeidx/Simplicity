const Requirements = require('./command/Requirements')
const Embed = require('./Embed')

class Command {
  constructor (client) {
    this.client = client
    this.name = 'none'
    this.category = 'none'
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
      console.log(e)
      return this.sendError(context, e)
    }
  }

  sendError ({ t, author, prefix, send }, error) {
    const embed = new Embed({ t, author })
      .setError()
      .setDescription(error.message, error.options)

    if (error.onUsage && t(`commands:${this.name}.usage`) !== `${this.name}.usage`) {
      embed.addField('errors:usage', `${prefix + this.name} ${t(`commands:${this.name}.usage`)}`)
    }

    return send(embed)
  }
}
module.exports = Command
