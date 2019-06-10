const { SimplicityClient } = require('./src')
require('dotenv').config()

const client = new SimplicityClient({
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: [ 'TYPING_START' ]
})

client.login(process.env.BOT_TOKEN).catch(console.error)

process.on('uncaughtException', (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './')
  console.error('Uncaught Exception: ', errorMsg)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('Uncaught Promise Error: ', err)
})
