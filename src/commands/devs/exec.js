const { Command } = require('../../')
const exec = require('shell-exec')

class Exec extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['execute', 'run', 'npm']
    this.category = 'dev'
    this.requirements = { argsRequired: true, ownerOnly: true }
  }
  async run ({ message, args }) {
    message.delete()
    function Run (execc, message) {
      const { MessageEmbed } = require('discord.js')
      let embed = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setDescription(`Loading... ${this.client.emojis.get(process.env.LOADING_EMOJI_ID)}`)
      message.channel.send(embed).then(e => {
        exec(execc)
          .then(c => e.edit(embed.setDescription(JSON.stringify(c.stdout).replace(/\\n/g, '\n').slice(1, -1))))
          .catch(err => e.edit(embed.setDescription(`Error: ${err}`)))
      })
    }
    await Run(args.join(' '), message)
  }
}

module.exports = Exec
