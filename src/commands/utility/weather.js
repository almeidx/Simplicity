// const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')
// const weather = require('weather')

class Weather extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['temp']
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }

  run ({ author, send, args, t }) {
    send('this command isn\'t finished')
    /* const embed = new MessageEmbed()
    weather({ location: args.join(' ') }, function (err, response) {
      if (err || !response) {
        embed.setDescription(t('commands:weather.error'))
        return send(embed, { error: true })
      } else {
        embed.addField(t('commands:weather.temperature'), response[0].current.temperature)
        send(embed)
      } // later
    }) */
  }
}

module.exports = Weather
