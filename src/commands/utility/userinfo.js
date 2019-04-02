const { Command, Embed, Constants: { SPOTIFY_LOGO_PNG_URL, PERMISSIONS }, Parameters: { UserParameter }, PermissionsUtils } = require('../../')
const moment = require('moment')
const ADMINISTRATOR_PERMISSION = 'ADMINISTRATOR'
const NORMAL_PERMISSIONS = [
    'CHANGE_NICKNAME',
    'USE_VAD',
    'SPEAK',
    'CONNECT',
    'USE_EXTERNAL_EMOJIS',
    'READ_MESSAGE_HISTORY',
    'ATTACH_FILES',
    'EMBED_LINKS',
    'SEND_MESSAGES',
    'VIEW_CHANNEL',
    'ADD_REACTIONS',
    'CREATE_INSTANT_INVITE'
]

class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ui', 'user']
    this.category = 'util'
    this.requirements = { clientPermissions: ['EMBED_LINKS'] }
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

    const role = member && member.roles && member.roles.highest && (member.roles.highest.id !== guild.id) && member.roles.highest
    const rolesClean = member && member.roles && member.roles.sort((a, b) => b.position - a.position).map(r => r.name || r.toString()).slice(0, -1)
    const roles = member && member.roles && member.roles.sort((a, b) => b.position - a.position).map(r => r).slice(0, -1)
    const activity = presence && presence.activity
    const activityType = activity && activity.type && activity.name

    const embed = new Embed({ author, t, emoji, autoAuthor: false })
      .setAuthor(titles.join(' '), user.displayAvatarURL())
      .setThumbnail(user)
      .addField('» $$commands:userinfo.username', user.tag, true)

    if (nickname) embed.addField('» $$commands:userinfo.nickname', nickname, true)

    embed.addField('» $$commands:userinfo.id', user.id, true)

    if (status) embed.addField('» $$commands:userinfo.status', `#${presence.status} $$utils:status.${presence.status}`, true)
    if (role && rolesClean.length > 5) embed.addField('» $$commands:userinfo.highestRole', role.name || role.toString(), true)
    if (rolesClean.length <= 5) embed.addField('» $$commands:userinfo.roles', rolesClean.join(', '), true)
    if (activityType) embed.addField('» $$utils:activityType.' + activity.type, activity.name, true)

    embed.addField('» $$commands:userinfo.createdAt', `${created.format('LL')} (${created.fromNow()})`)

    if (joined) embed.addField('» $$commands:userinfo.joinedAt', `${joined.format('LL')} (${joined.fromNow()})`)

    // PERMISSIONS
    const memberPermissions = member && member.permissions && member.permissions.toArray().filter(p => !NORMAL_PERMISSIONS.includes(p))
    const resultAdministrator = memberPermissions && memberPermissions.includes(ADMINISTRATOR_PERMISSION) && t('permissions:' + ADMINISTRATOR_PERMISSION)
    const resultAllPermissions = memberPermissions && memberPermissions.sort((a, b) => PERMISSIONS.indexOf(a) - PERMISSIONS.indexOf(b))
    const resultPermissions = memberPermissions && (resultAdministrator || (resultAllPermissions && resultAllPermissions.map(p => t('permissions:' + p)).join(', ')))

    if (resultPermissions) embed.addField('» $$commands:userinfo.permissions', resultPermissions)

    const msg = await send(embed)

    const permissions = channel.permissionsFor(guild.me)
    const restriction = activity && (activity.type === 'LISTENING') && activity.party && activity.party.id && activity.party.id.includes('spotify:')

    if (permissions.has('ADD_REACTIONS') && restriction && !user.bot) {
      const spotifyEmoji = emoji('SPOTIFY', { id: true, othur: 'MUSIC' })
      const userinfoEmoji = emoji('BACK', { id: true })
      const roleEmoji = emoji('ROLES', { id: true })

      if (restriction || (rolesClean && rolesClean.length > 5)) await msg.react(userinfoEmoji)
      if (restriction) await msg.react(spotifyEmoji)
      if (rolesClean && rolesClean.length > 5) await msg.react(roleEmoji)

      const trackName = activity.details
      const artist = activity.state.split(';').join(',')
      const album = activity.assets && activity.assets.largeText
      const image = activity.assets && activity.assets.largeImage && `https://i.scdn.co/image/${activity.assets.largeImage.replace('spotify:', '')}`

      const spotifyEmbed = new Embed({ author, t })
        .setAuthor('» $$commands:userinfo.spotify', SPOTIFY_LOGO_PNG_URL)
        .addField('» $$commands:userinfo.track', trackName, true)
        .addField('» $$commands:userinfo.artist', artist, true)
        .addField('» $$commands:userinfo.album', album, true)
        .setColor('GREEN')

      if (image) spotifyEmbed.setThumbnail(image)

      const roleEmbed = new Embed({ author, t })
        .setAuthor('» $$commands:userinfo.authorRoles', user.displayAvatarURL(), '', { user: user.username })
        .setDescription(roles.join('\n'))

      const filter = (r, u) => r.me && author.id === u.id
      const collector = await msg.createReactionCollector(filter, { errors: ['time'], time: 30000 })

      collector.on('collect', async ({ emoji, users, message }) => {
        const name = emoji.id || emoji.name
        const checkEmbed = (e) => e.author.name === message.embeds[0].author.name

        if (permissions.has('MANAGE_MESSAGES')) await users.remove(user.id)
        if (name === spotifyEmoji && !checkEmbed(spotifyEmbed)) await msg.edit(spotifyEmbed)
        if (name === userinfoEmoji && !checkEmbed(embed)) await msg.edit(embed)
        if (name === roleEmoji && !checkEmbed(roleEmbed)) await msg.edit(roleEmbed)
      })
      collector.on('end', async () => {
        if (msg && permissions.has('MANAGE_MESSAGES')) await msg.reactions.removeAll().catch(() => {})
      })
    }
  }
}

module.exports = UserInfo
