require('dotenv').config()

const { Bot } = require('./src')
const client = new Bot({
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: ['TYPING_START']
})
client.login(process.env.BOT_TOKEN).catch((e) => console.error(e))
