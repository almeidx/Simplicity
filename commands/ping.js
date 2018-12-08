module.exports = {
    run: async function(message, client) {
        message.channel.send("Ping...").then(msg => {
        msg.edit(`A Latência é ${msg.createdTimestamp - message.createdTimestamp} ms. A Latência do API é ${Math.floor(client.ping)} ms.`)})
    }
}