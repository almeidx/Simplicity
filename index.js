const { SimplicityClient } = require('./src')
require('dotenv').config()

const client = new SimplicityClient({
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: [ 'TYPING_START' ]
})

client.login(process.env.BOT_TOKEN).catch(console.error)
