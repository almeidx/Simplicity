module.exports = {
  run: async function (message, client, [amount]) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.reply(`You require the **Manage Messages** permission in order to execute this command!`)
    };
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
      return message.reply(`I require the **Manage Messages** permission in order to execute this command!`)
    };
    let total = parseInt(amount, 10)
    if (!total || total <= 2 || total >= 100) {
      return message.reply('Por favor, indique entre 2 a 100 mensagens!')
    };
    const res = await message.channel.fetchMessages({ limit: total })
    message.channel.bulkDelete(res)
      // eslint-disable-next-line handle-callback-err
      .catch(error => {
        return message.reply('An error has ocurred while trying to delete the messages.')
      })
    message.channel.send(`${res.size} messages have been deleted by ${message.author}. `)
      .then(m => m.delete(15000))
      .catch(err => console.log(err))
  },
  aliases: ['purge', 'clean']
}
