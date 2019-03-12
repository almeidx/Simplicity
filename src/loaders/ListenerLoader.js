const FileUtils = require('../utils/FileUtils')
const Loader = require('../structures/Loader')

class ListenerLoader extends Loader {
  constructor (client) {
    super(client)
    this.required = true
  }

  async load () {
    const logs = []
    await FileUtils.requireDirectory('src/listeners', (Listener, fileName) => {
      const listener = new Listener(this.client)
      const Llogs = listener.logs

      if (Llogs.length !== 0) {
        for (const i in Llogs) {
          logs.push(Llogs[i])
        }
      }

      this.client.on(fileName, (...args) => listener.on(this.client, ...args))
    }, console.error)

    this.client.availableLogs = logs

    return true
  }
}

module.exports = ListenerLoader
