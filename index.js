require('dotenv').config()

const { SimplicityClient } = require('./src')

const client = new SimplicityClient({
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: [ 'TYPING_START' ]
})

client.login(process.env.BOT_TOKEN).catch((e) => console.error(e))
