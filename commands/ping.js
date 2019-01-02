module.exports = {
  run: async function (message, client) {
    message.channel.send('Ping...')
      .then(msg => {
        msg.edit(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.floor(client.ping)}ms.`)
      })
  },
  aliases: ['pong']
}
