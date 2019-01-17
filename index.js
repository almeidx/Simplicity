require('dotenv').config()
const { Bot } = require('./src')
const client = new Bot()
global.invites = {}
client.login(process.env.BOT_TOKEN).catch(() => process.exit())
