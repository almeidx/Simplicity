const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Hex extends Command {
  constructor (client) {
    super(client)
    this.category = 'util'
  }

  run ({ send, args, t }) {
    const embed = new MessageEmbed()
      .setFooter('', '')

    if (args.length === 0) {
      const hex = '000000'.replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16)
      })

      embed.setAuthor(`Here's your hex color: #${hex}`, `http://www.colourlovers.com/img/${hex}/200/200/Sminted.png`)

      return send(embed, { authorFooter: false })
    }
  }
}

module.exports = Hex
