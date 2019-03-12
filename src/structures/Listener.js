class Listener {
  constructor (client, logs = []) {
    this.client = client
    this.logs = logs
  }

  on () {}

  sendMessage (envName, content) {
    const id = envName && process.env[envName.toUpperCase()]
    const channel = this.client && id && this.client.channels.get(id)
    if (channel) channel.send(content)
  }
}

module.exports = Listener
