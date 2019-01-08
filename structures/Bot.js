const { Client, Collection } = require('discord.js')
const { readdirSync, statSync } = require('fs')

module.exports = class Bot extends Client {
  constructor (options) {
    super(options)
    this.commands = new Collection()
  }

  initCommands (path) {
    readdirSync(path).forEach((file) => {
      let filePath = path + '/' + file
      if (file.endsWith('.js')) {
        let commandName = file.replace(/.js/g, '')
        let Command = require(filePath)
        let command = new Command(this)
        command.name = commandName
        let category = path.split(/\\|\//g).pop()
        if (category !== 'commands' && command.category === 'none') {
          command.category = category
        }
        this.commands.set(commandName, command)
      } else if (statSync(path).isDirectory()) {
        this.initCommands(filePath)
      }
    })
  }

  initListeners (path) {
    readdirSync(path).forEach((file) => {
      let name = file.replace(/.js/, '')
      this.on(name, require(path + '/' + file))
    })
  }
}
