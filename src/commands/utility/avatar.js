const { Command, Embed } = require('../../')

class Avatar extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['av']
    this.category = 'util'
    this.parameters = [{
      type: 'user',
      required: false,
      checkUserGlobal: true
    }]
    this.requirements = { permissions: ['EMBED_LINKS'] }
  }

  run ({ author, send, t }, user) {
    if (!user) user = author
    const embed = new Embed({ author, t, autoAuthor: false })
      .setImage(user.displayAvatarURL({ size: 2048 }))
    send(embed)
  }
}
module.exports = Avatar
