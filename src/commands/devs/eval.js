const { MessageEmbed } = require('discord.js')
const { inspect } = require('util')
const { Command } = require('../../')
class Eval extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['compile']
    this.description = 'This command lets my developers evaluate JavaScript code.'
    this.usage = `Usage: **${process.env.PREFIX}eval [code]**`
    this.category = 'Developer'
    this.argsRequired = true
  }
  run (message, args) {
    let code = args.join(' ').replace(/^```(js|javascript ?\n)?|```$/g, '')
    let value = (l, c) => `\`\`\`${l}\n${String(c).slice(0, 1000) + (c.length >= 1000 ? '...' : '')}\n\`\`\``.replace(process.env.BOT_TOKEN, () => '*'.repeat(process.env.BOT_TOKEN.length))
    let embed = new MessageEmbed()
      .setColor('#36393F')
    try {
      // eslint-disable-next-line no-eval
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
