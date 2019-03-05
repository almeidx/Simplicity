const { Client, Collection } = require('discord.js')
const Loaders = require('../loaders')
console.log(Loaders)
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
    this.database = new Database(this)
    this.loadFiles()
    this.initListeners(Path.join(__dirname, '../listeners'))
    this.initLocales(Path.join(__dirname, '../locales'))
  }

  async loadFiles () {
    for (const Loader of Object.values(Loaders)) {
      const loader = new Loader(this)
      let result
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await loader.load()
      } catch (err) {
        console.error(err)
        result = false
      } finally {
        if (!result && loader.required) process.exit(1)
      }
    }
  }

  get categories () {
    return this.commands.reduce((o, command) => {
      if (!o.has(command.category)) o.set(command.category, new Collection())
      o.get(command.category).set(command.name, command)
      return o
    }, new Collection())
  }

  initCommands (path) {
    fs.readdirSync(path).forEach((file) => {
      const filePath = path + '/' + file
      if (file.endsWith('.js')) {
        const commandName = file.replace(/.js/g, '')
        try {
          const Command = require(filePath)
          const command = new Command(this)
          command.name = commandName
          const category = path.split(/\\|\//g).pop()
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
      const name = file.replace(/.js/, '')
      this.on(name, require(path + '/' + file))
    })
  }

  async initLocales (path) {
    this.i18next.use(translationBackend).init({
      ns: [ 'categories', 'commands', 'errors', 'permissions', 'utils', 'loggers' ],
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
