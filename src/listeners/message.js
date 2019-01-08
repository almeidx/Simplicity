const { Emojis } = require('../')
module.exports = function onMessage (message) {
  if (message.author.bot ||
    message.type === 'dm' ||
    !message.guild.me.permissions.has('SEND_MESSAGES')) return
  if (message.mentions.has(this.user.id) && message.guild.me.permissions.has('ADD_REACTIONS')) {
    console.log(Emojis.get(message).SOCK_PING)
    message.react(Emojis.get(message).SOCK_PING)
  }
  if (!message.content.startsWith(process.env.PREFIX)) return
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g)
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
