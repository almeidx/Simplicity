const { Command, Embed, Parameters: { UserParameter } } = require('../../')

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

  async run ({ author, send, guild, client, query }) {
    const user = (await UserParameter.search(query, { client, guild })) || author
    const embed = new Embed({ author, autoAuthor: false })
      .setImage(user.displayAvatarURL({ size: 2048 }))
      .setAuthor(user.tag, user.displayAvatarURL())

    send(embed)
  }
}
module.exports = Avatar
