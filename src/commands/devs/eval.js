/* eslint-disable no-eval */
const { inspect } = require('util')
const { Command, Embed, Loggers } = require('../../')

class Eval extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['compile', 'ev']
    this.category = 'dev'
    this.requirements = { ownerOnly: true, argsRequired: true }
  }

  async run ({ author, guild, channel, member, language, command, prefix, message, query, send, args, t, emoji }) {
    const code = query.replace(/^```(js|javascript ?\n)?|```$/g, '')
    const value = (l, c) => `\`\`\`${l}\n${String(c).slice(0, 1000) + (c.length >= 1000 ? '...' : '')}\n\`\`\``.replace(process.env.BOT_TOKEN, () => '*'.repeat(process.env.BOT_TOKEN.length))

    const embed = new Embed()
    try {
      const resultEval = eval(code)
      const toEval = typeof resultEval === 'string' ? resultEval : inspect(resultEval, { depth: 1 })
      embed.addField('Result', value('js', toEval))
      embed.addField('Type', value('css', typeof resultEval))
      Loggers.warn(['COMMAND', 'EVAL', 'RESULT'], toEval)
    } catch (error) {
      embed.addField('Error', value('js', error))
      Loggers.error(['COMMAND', 'EVAL', 'RESULT', 'ERROR'], error)
    } finally {
      const msg = await send(embed)
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
module.exports = Eval
