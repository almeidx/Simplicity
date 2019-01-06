require('dotenv').config()
const { Client, Collection } = require('discord.js')
const client = new Client()
const fs = require('fs')
const Command = require('./structures/Command')
client.commands = new Collection()

fs.readdirSync('./commands').forEach((file) => {
  if (file.endsWith('.js')) {
    try {
      let Cmd = require(`./commands/${file}`)
      let name = file.replace('.js', '')
      if (typeof Cmd === 'function' && new Cmd() instanceof Command) {
        Cmd = new Cmd(name, client)
      }
      client.commands.set(name, Cmd)
    } catch (error) {
      console.log(`There was an error with command ${file}\n`, error)
    }
  }
})

fs.readdirSync('./listeners').forEach((file) => {
  if (file.endsWith('.js')) {
    try {
      const Listener = require('./listeners' + '/' + file)
      client.on(file.replace(/.js/g, ''), Listener)
    } catch (error) {
      console.error(`There was an error with the event ${file}\n`, error)
    }
  }
})

client.login(process.env.BOT_TOKEN)
