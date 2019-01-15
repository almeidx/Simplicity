const { CommandContext } = require('../')

module.exports = async function onMessage (message) {
  if (message.author.bot || message.type === 'dm' || !message.guild.me.permissions.has('SEND_MESSAGES')) return
  const guildData = await this.database.guilds.get(message.guild.id)
  const prefix = (guildData && guildData.prefix) ? guildData.prefix : process.env.PREFIX
  const botMention = this.user.toString()
  const usedPrefix = message.content.startsWith(botMention) ? `${botMention} ` : (message.content.startsWith(prefix) ? prefix : null)
  if (usedPrefix) {
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    const command = this.commands.find(c => c.name.toLowerCase() === commandName || c.aliases.includes(commandName))
    if (message.mentions.has(this.user.id) && message.guild.me.permissions.has(['USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']) && this.emojis.has(process.env.EMOJI_PINGSOCK_ID) && !command) {
      message.react(process.env.EMOJI_PINGSOCK_ID)
    }
    if (command) {
      command._run(new CommandContext({
        prefix: usedPrefix,
        language: guildData ? guildData.lang : process.env.DEFAULT_LANG,
        query: args.join(' '),
        command,
        message,
        args
      }))
    }
  }
}
