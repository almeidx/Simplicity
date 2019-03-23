const Requirements = require('./command/Requirements')
const Embed = require('./Embed')
const CommandError = require('./command/CommandError')
const CommandParameters = require('./command/CommandParameters')

class Command {
  constructor (client) {
    this.client = client
    this.name = 'none'
    this.category = 'none'
    this.aliases = []
    this.WIP = false
    this.requirements = null
    this.parameters = null
  }

  async run () {}

  async _run (context) {
    if (this.WIP) this.requirements = typeof this.requirements === 'object' ? this.requirements['ownerOnly'] = true : { ownerOnly: true }
    const requirements = new Requirements(this.requirements)
    try {
      await requirements.handle(context)
      const parameters = this.parameters ? (await Promise.all(CommandParameters.handle(context, this.parameters, context.args))) : []
      await this.run(context, ...parameters)
    } catch (e) {
      return this.sendError(context, e)
    }
  }

  sendError ({ t, author, prefix, send }, error) {
    if (!(error instanceof CommandError)) {
      console.error(error)
      if (process.env.CHANNEL_LOG_ERROR && this.client.channels.has(process.env.CHANNEL_LOG_ERROR)) {
        this.client.channels.get(process.env.CHANNEL_LOG_ERROR).send(`${error}`, { code: 'js' })
      }
      return send(t('errors:errorCommand'))
    }

    const embed = new Embed({ t, author })
      .setError()
      .setDescription(error.message, error.options)

    const usage = t(`commands:${this.name}.usage`)
    if (error.onUsage && usage !== `${this.name}.usage`) {
      embed.addField('errors:usage', `${prefix + this.name} ${usage}`)
    }

    return send(embed)
  }
}
module.exports = Command
