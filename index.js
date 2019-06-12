const { SimplicityClient } = require('./src')
require('dotenv').config()

const CLIENT_OPTIONS = {
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: [ 'TYPING_START' ],
  presence: {
    activity: {
      name: '@Simplicity help',
      type: 'WATCHING'
    }
  },
  ws: {
    large_threshold: 1000
  }
}

const client = new SimplicityClient(CLIENT_OPTIONS)

client.login(process.env.BOT_TOKEN).catch(console.error)

client
  .on('disconnect', () => console.log('Bot is disconnecting...'))
  .on('reconnect', () => console.log('Bot reconnecting...'))
  .on('warn', (warn) => console.log(warn))
  .on('invalidated', () => {
    console.log('The client\'s session is now invalidated.')
    process.exit(1)
  })

process
  .on('uncaughtException', (error) => {
    const msg = error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './')
    console.error('Uncaught Exception: ', msg)
    process.exit(1)
  })
  .on('unhandledRejection', (error) => {
    console.error('Uncaught Promise Error: ', error)
  })
