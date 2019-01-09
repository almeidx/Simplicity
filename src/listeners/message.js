const { Emojis } = require('../')
async function checkPrefix (message) {
  let prefixes = [process.env.PREFIX, `${message.client.user} `]
  let prefix
  let guildData = await message.client.Database.guilds.get(message.guild.id)
  if (guildData) {
    prefix = guildData.prefix
  }
  if (prefix) {
    if (message.content.startsWith(prefix)) {
      return prefix
    }
  } else return prefixes.find(prefix => message.content.startsWith(prefix))
}

module.exports = async function onMessage (message) {
  if (message.author.bot ||
    message.type === 'dm' ||
    !message.guild.me.permissions.has('SEND_MESSAGES')) return
  if (message.mentions.has(this.user.id) && message.guild.me.permissions.has('ADD_REACTIONS')) {
    message.react(Emojis.get(message, 'SOCK_PING', false))
  }
  let prefix = await checkPrefix(message)
  if (!prefix) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const commandName = args.shift().toLowerCase()
  const command = this.commands.find((c, i) => i === commandName || (Array.isArray(c.aliases) && c.aliases.includes(commandName)))
  if (command) {
    if (typeof command._run === 'function') {
      command._run(message, args)
    } else {
      command.run(message, this, args)
    }
  }
}
