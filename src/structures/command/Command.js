const Requirements = require('./Requirements')
const SimplicityEmbed = require('../discord/SimplicityEmbed')
const CommandError = require('./CommandError')
const RunStore = require('./stores/RunStore')

class Command {
  constructor (client, options = {}) {
    this.client = client
    this.name = 'none'
    this.category = 'none'
    this.aliases = []
    this.requirements = null
    this.responses = {}
    this.subcommands = []
    this.running = new RunStore()
    this.setup(options)
  }

  setup (options) {
    if (options.aliases) {
      options.aliases.forEach(e => this.aliases.push(e))
    }
  }

  async run () {}

  async _run (context) {
    try {
      const requirements = new Requirements(this.requirements, this.responses)
      const subcommand = context.args[0] && this.getSubcommand(context.args[0].toLowerCase())
      if (subcommand) {
        await this.runSubcommand(subcommand, context)
        return
      }
      await requirements.handle(context)
      await this.run(context)
    } catch (e) {
      return this.sendError(context, e)
    }
  }

  getSubcommand (name) {
    return this.subcommands.find(i => i.name === name || (Array.isArray(i.aliases) && i.aliases.includes(name)))
  }

  runSubcommand (subcommand, context) {
    context.query = context.query.replace(context.args[0] + ' ', '').slice(1)
    context.args = context.args.slice(1)
    return subcommand._run(context)
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
        const embedError = new SimplicityEmbed(null, { type: 'error' })
          .addField('» Info', `**${infos.join('\n')}**`)
          .addField('» Error', `**» ID: ${error.message}\n\`\`\`js\n${error.stack}\n\`\`\`**`)
        channelError.send(embedError)
        const embed = new SimplicityEmbed({ t, author }, { type: 'error' })
          .setDescription(t('errors:errorCommand'))
          .setText('@description')
        return send(embed)
      }
    }

    const embed = new SimplicityEmbed({ t, author })
      .setError()
      .setDescription(t(error.message, error.options))

    const strUsage = `commands:${this.name}.usage`
    const usage = error.onUsage && this.client.i18next.exists(strUsage) && t(strUsage)

    if (usage) embed.addField('errors:usage', `${prefix + this.name} ${usage}`)

    if (error.fields && error.fields.length > 0) {
      for (const i in error.fields) {
        const field = error.fields[i]
        embed.addField(field.name, field.value, field.inline, field.options, field.valueOptions)
      }
    }

    let fields = ''
    if (embed.fields.length > 0) {
      for (const i in embed.fields) {
        fields += `\`@fields.${i}.name \` @fields.${i}.value \n`
      }
    }

    embed.setText('@description ' + fields)
    return send(embed)
  }
}

module.exports = Command
