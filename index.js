require('dotenv').config()
const { Bot } = require('./src')
const client = new Bot({ fetchAllMembers: true, disableEveryone: true })
client.login(process.env.BOT_TOKEN).catch(() => process.exit())
