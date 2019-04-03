const Requirements = require('./Requirements')
const Embed = require('../Embed')
const CommandError = require('./CommandError')

class Command {
  constructor (client) {
    this.client = client
    this.name = 'none'
    this.category = 'none'
    this.aliases = []
    this.WIP = false
    this.requirements = null
    this.responses = {}
  }

  async run () {}

  async _run (context) {
    if (this.WIP) this.requirements = typeof this.requirements === 'object' ? this.requirements['ownerOnly'] = true : { ownerOnly: true }
    const requirements = new Requirements(this.requirements, this.responses)
    try {
      await requirements.handle(context)
      await this.run(context)
    } catch (e) {
      return this.sendError(context, e)
    }
  }

  sendError ({ t, author, prefix, channel, guild, message, send }, error) {
    if (!(error instanceof CommandError)) {
      console.error(error)
      const channelError = process.env.CHANNEL_LOG_ERROR && this.client.channels.get(process.env.CHANNEL_LOG_ERROR)
      if (channelError) {
        const infos = [
          `» User: ${author.toString()} *[${author.id}]*`,
          `» Channel: ${channel.type === 'dm' ? 'DM' : `*${channel.toString()} [${channel.id}]`}*`,
          `» Guild: ${guild ? guild.name + ` [${guild.id}]` : 'DM'}`,
          `» Message: ${message.content} *[${message.id}]*`
        ]
        const embedError = new Embed(null, { type: 'error' })
          .addField('» Info', `**${infos.join('\n')}**`)
          .addField('» Error', `**» ID: ${error.message}\n\`\`\`js\n${error.stack}\n\`\`\`**`)
        channelError.send(embedError)
      }
    }

    const embed = new Embed({ t, author })
      .setError()
      .setDescription(t([error.message, 'errors:errorCommand'], error.options))

    const strUsage = `commands:${this.name}.usage`
    const usage = error.onUsage && this.client.exists(strUsage) && t(strUsage)

    if (usage) embed.addField('errors:usage', `${prefix + this.name} ${usage}`)

    embed.setText('@description \n' + (usage ? '`@fields.0.name ` @fields.0.value' : ''))
    return send(embed)
  }
}

module.exports = Command
