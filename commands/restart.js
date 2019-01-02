module.exports = {
  run: async function (message, client, args) {
    if (!process.env.DEVS.includes(message.author.id)) {
      return message.reply('You must be a developer in order to execute this command!')
    };
    resetBot(message.channel)
    async function resetBot (channel) {
      channel.send('Restarting...')
        .then(m => {
          client.on('ready', () => {
            m.edit(`Sucessfully restarted the bot in ${message.createdTimestamp - m.createdTimestamp}ms.`)
            m.react('✅')
          })
        })
        .then(msg => client.destroy())
        .then(() => client.login(process.env.BOT_TOKEN))
    }
  },
  aliases: ['reiniciar']
}
