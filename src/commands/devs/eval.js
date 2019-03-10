const { Command, Embed, Loggers } = require('../../')
const { inspect } = require('util')
const value = (l, c) => `\`\`\`${l}\n${String(c).slice(0, 1000) + (c.length >= 1000 ? '...' : '')}\n\`\`\``.replace(process.env.BOT_TOKEN, () => '*'.repeat(process.env.BOT_TOKEN.length))

class Eval extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['compile', 'ev']
    this.category = 'dev'
    this.requirements = { ownerOnly: true, argsRequired: true }
  }

  async run ({ author, guild, channel, member, language, command, prefix, message, query, send, args, t, emoji }) {
    const embed = new Embed()

    const code = query.replace(/^```(js|javascript ?\n)?|```$/g, '')

    try {
      const evald = eval(code)
      const toEval = typeof evald === 'string' ? evald : inspect(evald, { depth: 1 })

      embed
        .addField('Result', value('js', toEval))
        .addField('Type', value('css', typeof evald))

      if (evald) Loggers.warn(['COMMAND', 'EVAL-RESULT'], toEval)
    } catch (error) {
      embed
        .addField('Error', value('js', error))

      Loggers.error(['COMMAND', 'EVAL-RESULT'], error)
    } finally {
      const msg = await send(embed)

      const perms = channel.permissionsFor(guild.me)

      if (perms.has('ADD_REACTION') && perms.has('MANAGE_MESSAGES')) {
        await msg.react(emoji('CANCEL', { id: true }))

        const filter = (r, u) => r.me && message.author.id === u.id
        const collector = await msg.createReactionCollector(filter, { max: 1, errors: ['time'], time: 15000 })

        collector.on('collect', async () => {
          await msg.delete()
          await message.delete()
        })
        collector.on('end', () => {
          if (msg) msg.reactions.removeAll()
        })
      }
    }
  }
}

module.exports = Eval
