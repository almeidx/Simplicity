const { Command, Embed, Parameters: { UserParameter } } = require('../../')
const User = new UserParameter({ required: false, checkUserGlobal: true })

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

  async run (context) {
    const { author, args, send } = context
    let user = await User.handle(context, args)
    if (!user) user = author

    const embed = new Embed({ author, autoAuthor: false })
      .setImage(user.displayAvatarURL({ size: 2048 }))
      .setAuthor(user.tag, user.displayAvatarURL())

    send(embed)
  }
}
module.exports = Avatar
