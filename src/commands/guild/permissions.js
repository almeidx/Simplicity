const { Command, Constants, Parameters, SimplicityEmbed, CommandError } = require('../..')
const { MANAGER_PERMISSIONS } = Constants
const { MemberParameter, RoleParameter } = Parameters
const checkTick = (c) => c ? 'TICK_YES' : 'TICK_NO'

const optionsRoleParameter = {
  checkStartsWith: false,
  checkEndsWith: false
}

class Permissions extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['perms', 'perm', 'permission']
    this.category = 'guild'
    this.requirements = {
      guildOnly: true
    }
  }

  async run ({ member, emoji, guild, query, send, t }) {
    const m = !query ? member : (await RoleParameter.search(query, { guild }, optionsRoleParameter)) || (await MemberParameter.search(query, { guild }))

    if (!m) throw new CommandError('commands:permissions.error')

    const avatar = m.user ? m.user.displayAvatarURL() : guild.iconURL()
    const name = m.user ? m.user.tag : m.name
    const title = m.user ? 'commands:permissions.author' : 'commands:permissions.role'

    const embed = new SimplicityEmbed({ author: member, emoji, t })
      .setAuthor(title, avatar, null, { name })

    for (const p of MANAGER_PERMISSIONS) {
      embed.addField(`permissions:${p}`, `#${checkTick(m.permissions.has(p))}`, true)
    }

    let r
    const yEmoji = emoji('TICK_YES')
    const nEmoji = emoji('TICK_NO')

    const yResult = embed.fields.filter(f => f.value === yEmoji).length
    const nResult = embed.fields.filter(f => f.value === nEmoji).length

    if ((Math.abs((yResult / embed.fields.length) * 100)).toFixed(2) >= 70) r = 'GREEN'
    if ((Math.abs((nResult / embed.fields.length) * 100)).toFixed(2) >= 70) r = 'RED'
    if (yResult === nResult) r = null
    if (r) embed.setColor(r)

    return send(embed)
  }
}

module.exports = Permissions
