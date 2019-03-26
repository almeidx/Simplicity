const { Command, Embed, Parameters: { UserParameter } } = require('../../')
const moment = require('moment')

class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ui', 'user']
    this.category = 'util'
    this.requirements = { permissions: ['EMBED_LINKS'] }
  }

  async run ({ author, channel, client, guild, send, t, query, emoji }) {
    const user = (!query ? author : await UserParameter.parse(query, { client, guild }, { missingError: 'errors:invalidUser', required: true })) || author
    const member = guild && guild.member(user)

    const presence = client.users.has(user.id) && user.presence
    const created = moment(user.createdAt)
    const joined = member && moment(member.joinedAt)

    const embed = new Embed({ author, t, emoji, autoAuthor: false })
      .setAuthor(user.tag, user.displayAvatarURL())
      .setThumbnail(user.displayAvatarURL())
      .addField('commands:userinfo.name', user.tag, true)
      .addField('commands:userinfo.id', user.id, true)

    if (presence && presence.status) embed.addField('commands:userinfo.status', `utils:status.${presence.status}`, true, {}, { emoji: presence.status })

    embed.addField('commands:userinfo.createdAt', `${created.format('LL')} (${created.fromNow()})`)

    if (joined) embed.addField('commands:userinfo.joinedAt', `${joined.format('LL')} (${joined.fromNow()})`)

    const msg = await send(embed)
    
    const perms = channel.permissionsFor(client.user)
    const restriction = presence && presence.activity && presence.activity.party && presence.activity.party.id && presence.activity.party.id.includes('spotify:')
    
    if (perms.has('ADD_REACTIONS') && restriction && !user.bot) {
      const reaction = (perms.has('USE_EXTERNAL_EMOJIS') && client.emojis.has(emoji('SPOTIFY', { id: true })) ? emoji('SPOTIFY', { id: true }) : emoji('MUSIC'))
      await msg.react(reaction)
      
      const activity = presence.activity
      const trackName = activity.details
      const artist = activity.state
      const album = activity.assets.largeText
      const image = activity.assets.largeImage && `https://i.scdn.co/image/${activity.assets.largeImage.replace('spotify:', '')}`
      
      const spotifyEmbed = new Embed({ author, t })
        .setTitle('commands:userinfo.spotify')
        .addField('commands:userinfo.track', trackName, true)
        .addField('commands:userinfo.artist', artist, true)
        .addField('commands:userinfo.album', album, true)
        .setColor('GREEN')
      if (image) spotifyEmbed.setThumbnail(image)
      
      const filter = (r, u) => r.me && author.id === u.id
      const collector = await msg.createReactionCollector(filter, { max: 1, errors: ['time'], time: 30000 })
  
      collector.on('collect', async () => {
        await msg.edit(spotifyEmbed)
      })
      collector.on('end', () => {
        if (msg) msg.reactions.removeAll()
      })
    }
  }
}

module.exports = UserInfo
