const { Command, SimplicityEmbed, Constants, Parameters: { UserParameter }, PermissionsUtils } = require('../../')
const { SPOTIFY_LOGO_PNG_URL, PERMISSIONS, ADMINISTRATOR_PERMISSION, NORMAL_PERMISSIONS } = Constants
const moment = require('moment')

class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'ui', 'user' ]
    this.category = 'util'
    this.requirements = { clientPermissions: [ 'EMBED_LINKS' ] }
  }

  async run ({ author, client, channel, emoji, guild, query, send, t }) {
    const user = (!query ? author : await UserParameter.parse(query, {
      errors: { missingError: 'errors:invalidUser' },
      required: true
    }, { client, guild }))

    const titles = []

    titles.push(user.tag)
    if (guild && guild.ownerID === user.id) titles.push(`#crown`)
    if (PermissionsUtils.verifyDev(user.id, client)) titles.push(`#developer`)
    if (user.bot) titles.push(`#bot`)

    const member = guild && guild.member(user)
    const nickname = member && member.nickname
    const created = moment(user.createdAt)
    const joined = member && moment(member.joinedAt)

    const presence = client.users.has(user.id) && user.presence
    const clientStatus = presence && presence.clientStatus
    const status = clientStatus && (clientStatus.desktop || clientStatus.mobile || clientStatus.web)

    const highestRole = member && member.roles && member.roles.highest && (member.roles.highest.id !== guild.id) && member.roles.highest
    const roles = member && member.roles && member.roles.sort((a, b) => b.position - a.position).map(r => r).slice(0, -1)
    const rolesClean = roles && roles.map(r => r.name || r.toString())
    const activity = presence && presence.activity
    const activityType = activity && activity.type && activity.name

    const embed = new SimplicityEmbed({ author, t, emoji, autoAuthor: false })
      .setAuthor(titles.join(' '), user.displayAvatarURL())
      .setThumbnail(user)
      .addField('» $$commands:userinfo.username', user.tag, true)

    if (nickname) embed.addField('» $$commands:userinfo.nickname', nickname, true)

    embed.addField('» $$commands:userinfo.id', user.id, true)

    if (status) embed.addField('» $$commands:userinfo.status', `#${presence.status} $$common:status.${presence.status}`, true)
    if (highestRole && roles.length > 5) embed.addField('» $$commands:userinfo.highestRole', highestRole.name || highestRole.toString(), true)
    if (rolesClean && rolesClean.length <= 5 && rolesClean.join(', ')) embed.addField('» $$commands:userinfo.roles', rolesClean.join(', '), true)
    if (activityType) embed.addField('» $$common:activityType.' + activity.type, activity.name, true)

    embed.addField('» $$commands:userinfo.createdAt', `${created.format('LL')} (${created.fromNow()})`)

    if (joined) embed.addField('» $$commands:userinfo.joinedAt', `${joined.format('LL')} (${joined.fromNow()})`)

    // PERMISSIONS
    const memberPermissions = member && member.permissions && member.permissions.toArray().filter(p => !NORMAL_PERMISSIONS.includes(p))
    const resultAdministrator = memberPermissions && memberPermissions.includes(ADMINISTRATOR_PERMISSION) && t('permissions:' + ADMINISTRATOR_PERMISSION)
    const resultAllPermissions = memberPermissions && memberPermissions.sort((a, b) => PERMISSIONS.indexOf(a) - PERMISSIONS.indexOf(b))
    const resultPermissions = memberPermissions && (resultAdministrator || (resultAllPermissions && resultAllPermissions.map(p => t('permissions:' + p)).join(', ')))

    if (resultPermissions) embed.addField('» $$commands:userinfo.permissions', resultPermissions)

    const message = await send(embed)

    const permissions = channel.permissionsFor(guild.me)
    const spotifyRestriction = activity && (activity.type === 'LISTENING') && activity.party && activity.party.id && activity.party.id.includes('spotify:')

    if (permissions.has('ADD_REACTIONS')) {
      let spotify, role

      if (spotifyRestriction && !user.bot) {
        spotify = {
          emoji: emoji('SPOTIFY', { id: true, othur: 'MUSIC' }),
          embed: createEmbedSpotify(activity, { author, t })
        }
        await message.react(spotify.emoji)
      }

      if (rolesClean && rolesClean.length > 5) {
        role = {
          emoji: emoji('ROLES', { id: true }),
          embed: createEmbedRoles(roles, user, { author, t })
        }
        await message.react(role.emoji)
      }

      if (spotify || role) {
        const userinfoEmoji = emoji('BACK', { id: true })
        await message.react(userinfoEmoji)

        const filter = (r, u) => r.me && author.id === u.id
        const collector = await message.createReactionCollector(filter, { errors: ['time'], time: 30000 })

        collector.on('collect', async ({ emoji, users, message }) => {
          const name = emoji.id || emoji.name
          const checkEmbed = (e) => e.author.name === message.embeds[0].author.name

          if (permissions.has('MANAGE_MESSAGES')) await users.remove(user.id)
          if (spotify && name === spotify.emoji && !checkEmbed(spotify.embed)) await message.edit(spotify.embed)
          if (name === userinfoEmoji && !checkEmbed(embed)) await message.edit(embed)
          if (role && name === role.emoji && !checkEmbed(role.embed)) await message.edit(role.embed)
        })

        collector.on('end', async () => {
          if (message && permissions.has('MANAGE_MESSAGES')) await message.reactions.removeAll().catch(() => {})
        })
      }
    }
  }
}

function createEmbedSpotify (activity, embedOptions) {
  const trackName = activity.details
  const artist = activity.state.split(';').join(',')
  const album = activity.assets && activity.assets.largeText
  const image = activity.assets && activity.assets.largeImage && `https://i.scdn.co/image/${activity.assets.largeImage.replace('spotify:', '')}`

  const embed = new SimplicityEmbed(embedOptions)
    .setAuthor('commands:userinfo.spotify', SPOTIFY_LOGO_PNG_URL)
    .addField('» $$commands:userinfo.track', trackName, true)
    .addField('» $$commands:userinfo.artist', artist, true)
    .addField('» $$commands:userinfo.album', album)
    .setColor('GREEN')

  if (image) embed.setThumbnail(image)
  return embed
}

function createEmbedRoles (roles, user, embedOptions) {
  const role = roles && roles.find(r => r.color)
  return new SimplicityEmbed(embedOptions)
    .setAuthor('» $$commands:userinfo.authorRoles', user.displayAvatarURL(), '', { user: user.username })
    .setDescription(roles.join('\n'))
    .setColor(role ? role.color : process.env.COLOR)
}

module.exports = UserInfo
