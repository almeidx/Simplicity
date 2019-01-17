const { Client, Collection } = require('discord.js')
const Database = require('../database/Database')
const fs = require('fs')
const Path = require('path')
const { promisify } = require('util')
const readdir = promisify(fs.readdir)
const translationBackend = require('i18next-node-fs-backend')

module.exports = class Bot extends Client {
  constructor (options) {
    super(options)
    this.i18next = require('i18next')
    this.commands = new Collection()
    this.database = new Database(this)
    this.initCommands(Path.join(__dirname, '../commands'))
    this.initListeners(Path.join(__dirname, '../listeners'))
    this.initLocales(Path.join(__dirname, '../locales'))
  }
  initCommands (path) {
    fs.readdirSync(path).forEach((file) => {
      let filePath = path + '/' + file
      if (file.endsWith('.js')) {
        let commandName = file.replace(/.js/g, '')
        try {
          let Command = require(filePath)
          let command = new Command(this)
          command.name = commandName
          let category = path.split(/\\|\//g).pop()
          if (category !== 'commands' && command.category === 'none') {
            command.category = category
          }
          this.commands.set(commandName, command)
        } catch (err) {
          console.error(err)
        }
      } else if (fs.statSync(path).isDirectory()) {
        this.initCommands(filePath)
      }
    })
  }
  initListeners (path) {
    fs.readdirSync(path).forEach((file) => {
      let name = file.replace(/.js/, '')
      this.on(name, require(path + '/' + file))
    })
  }
  async initLocales (path) {
    this.i18next.use(translationBackend).init({
      ns: [ 'categories', 'commands', 'errors', 'permissions' ],
      preload: await readdir(path),
      fallbackLng: 'en-US',
      backend: {
        loadPath: `${path}/{{lng}}/{{ns}}.json`
      },
      interpolation: {
        escapeValue: false
      },
      returnEmptyString: false
    }, () => {
      console.log(Object.keys(this.i18next.store.data))
    })
  }
}
