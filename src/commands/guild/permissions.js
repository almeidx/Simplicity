const { Command, CommandError, Constants, Parameters, SimplicityEmbed } = require('../..')
const { ADMINISTRATOR_PERMISSION, NORMAL_PERMISSIONS, PERMISSIONS } = Constants
const { UserParameter } = Parameters
const checkTick = (c) => c ? 'TICK_YES' : 'TICK_NO'
const optionsParameter = {
	required: true,
	canBeAuthor: true,
	checkGlobally: false,
	canBeGuildOwner: true,
	errors: {
		missingError: 'errors:invalidUser'
	}
}

class Permissions extends Command {
	constructor (client) {
		super(client)
		this.aliases = ['perms']
		this.category = 'guild'
	}

	async run ({ author, client, emoji, guild, query, send, t }) {
		const user = !query ? author : await UserParameter.search(query, { client, guild }, optionsParameter)
		const member = user && guild.member(user)
		if (!member) throw new CommandError('errors:invalidUser')

		const memberPermissions = member && member.permissions && member.permissions.toArray().filter(p => !NORMAL_PERMISSIONS.includes(p))
		const resultAdministrator = memberPermissions && memberPermissions.includes(ADMINISTRATOR_PERMISSION) && t('permissions:' + ADMINISTRATOR_PERMISSION)
		const resultAllPermissions = memberPermissions && memberPermissions.sort((a, b) => PERMISSIONS.indexOf(a) - PERMISSIONS.indexOf(b))
		const resultPermissions = memberPermissions && (resultAdministrator || (resultAllPermissions && resultAllPermissions))

		const embed = new SimplicityEmbed({ author, emoji, t })
			.setAuthor('commands:permissions.author', user.displayAvatarURL(), null, { user: user.tag })

		if (resultPermissions) {
			if (Array.isArray(resultPermissions)) {
				resultPermissions.forEach(p => {
					embed.addField(`permissions:${p}`, `#${checkTick(member.permissions.has(p))}`, true)
				})
			} else {
        embed.addField(`permissions:${resultPermissions.toUpperCase()}`, `#${checkTick(member.permissions.has(resultPermissions.toUpperCase()))}`)
			}
		}

		return send(embed)
	}
}

module.exports = Permissions
