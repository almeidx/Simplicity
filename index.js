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

process.on('uncaughtException', (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './')
  console.error('Uncaught Exception: ', errorMsg)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('Uncaught Promise Error: ', err)
})
