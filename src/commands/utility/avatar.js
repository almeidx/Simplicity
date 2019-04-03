const { Command, Embed, CommandError, Parameters: { UserParameter } } = require('../../')
const { MessageAttachment } = require('discord.js')

class Avatar extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['av']
    this.category = 'util'
  }

  async run ({ author, send, guild, channel, client, query, emoji, t }) {
    const user = (await UserParameter.search(query, { client, guild })) || author
    const avatarURL = user.displayAvatarURL({ size: 2048 })

    const clientPermissions = channel.permissionsFor(guild.me)

    if (!guild || clientPermissions.has('EMBED_LINKS')) {
      const embed = new Embed({ author })
        .setAuthor(user)
        .setImage(avatarURL)

      return send(embed)
    }

    if (!guild || clientPermissions.has('ATTACH_FILES')) {
      const content = `${emoji('PHOTO')} **${t('commands:avatar.message', { user })}**`
      return send({ content, files: [new MessageAttachment(avatarURL, 'avatar.png')] })
    }

    const permissions = ['EMBED_LINKS', 'ATTACH_FILES'].map(p => t('permissions:' + p)).join(', ')
    throw new CommandError('errors:clientMissingPermission', { permissions })
  }
}
module.exports = Avatar
