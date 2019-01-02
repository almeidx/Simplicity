module.exports = {
  run: async function (message, client, args) {
    if (!process.env.DEVS.includes(message.author.id)) {
      return message.reply('You must be a developer in order to execute this command!')
    };
    if (args.length === 0) {
      return message.reply('You didn\'t provide a command name.')
    };
    try {
      delete require.cache[require.resolve(`./${args}.js`)]
    } catch (e) {
      return message.reply(`I could'nt find any command with the name **${args[0]}**!`)
    };
    message.reply(`The command **${args}** has been reloaded sucessfully!`)
  },
  aliases: ['rl']
}
