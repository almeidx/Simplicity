const { Embed } = require('../')
function Disconnect () {
  console.log(`The bot has disconnected at ${require('moment')().format('LLL')}`)

  const embed = new Embed()
    .setTimestamp()
    .setTitle('Bot disconnected')
    .setColor('RED')
    .setFooter(this.user.username, this.user.displayAvatarURL())

  if (process.env.BOT_LOG && this.channels.has(process.env.BOT_LOG)) {
    this.channels.get(process.env.BOT_LOG).send(embed)
  }
}

module.exports = Disconnect
