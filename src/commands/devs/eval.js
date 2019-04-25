const { Command, CommandError, SimplicityEmbed, Utils } = require('../../')
const { inspect } = require('util')
const { code } = Utils
const value = (lang, str) => code(str, lang).replace(process.env.BOT_TOKEN, () => '*'.repeat(process.env.BOT_TOKEN.length))

class Eval extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'compile', 'ev', 'evaluate' ]
    this.category = 'dev'
    this.requirements = {
      ownerOnly: true,
      argsRequired: true }
  }

  async run ({ author, botLanguages, client, guild, channel, member, language, command, prefix, message, query, send, args, t, emoji }) {
    const embed = new SimplicityEmbed({ author })

    const text = query.replace(/^```(js|javascript ?\n)?|```$/g, '')

    try {
      const evald = eval(text)
      const toEval = inspect(evald, { depth: 0 })

      embed
        .setDescription(value('js', toEval))
        .setColor('GREEN')

      if (!toEval || !evald) embed.setColor('RED')
      if (toEval) console.warn(['COMMAND', 'EVAL-RESULT'], toEval)
    } catch (error) {
      embed
        .setDescription(value('js', error))
        .setColor('RED')

      console.error(['COMMAND', 'EVAL-RESULT'], error)
    } finally {
      const msg = await send(embed)

      const permissions = channel.permissionsFor(guild.me)

      if (permissions.has('ADD_REACTION') && permissions.has('MANAGE_MESSAGES')) {
        await msg.react(emoji('CANCEL', { id: true }))

        const filter = (r, u) => r.me && message.author.id === u.id
        const collector = await msg.createReactionCollector(filter, { max: 1, errors: ['time'], time: 30000 })

        collector.on('collect', async () => {
          if (msg) await msg.delete()
          if (message) await message.delete()
        })
        collector.on('end', async () => {
          if (msg) await msg.reactions.removeAll().catch(() => null)
        })
      }
    }
  }
}

module.exports = Eval
