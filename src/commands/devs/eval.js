const { MessageEmbed } = require('discord.js')
const { inspect } = require('util')
const { Command } = require('../../')

class Eval extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['compile']
    this.category = 'dev'
    this.requirements = { ownerOnly: true, argsRequired: true }
  }

  run ({ message, query }) {
    let code = query.replace(/^```(js|javascript ?\n)?|```$/g, '')
    let value = (l, c) => `\`\`\`${l}\n${String(c).slice(0, 1000) + (c.length >= 1000 ? '...' : '')}\n\`\`\``.replace(process.env.BOT_TOKEN, () => '*'.repeat(process.env.BOT_TOKEN.length))
    let embed = new MessageEmbed()
      .setColor(process.env.COLOR)
    try {
      let resultEval = eval(code)
      let toEval = typeof resultEval === 'string' ? resultEval : inspect(resultEval, { depth: 1 })
      embed.addField('Result', value('js', toEval))
      embed.addField('Type', value('css', typeof resultEval))
    } catch (error) {
      embed.addField('Error', value('js', error))
    } finally {
      message.channel.send(embed)
    };
  }
}

module.exports = Eval
