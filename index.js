require("dotenv").config();
const { Client, Collection } = require('discord.js');
const client = new Client();
const fs = require('fs');
client.commands = new Collection();

// Export Commands
fs.readdirSync('./commands').forEach((file) => { 
    if (file.endsWith('.js')) {
        try {
            const command = require(`./commands/${file}`);
            client.commands.set(file.replace('.js', ''), command);
        } catch(error) {
            console.log(`There was an error with command ${file}\n`, error);
        }
    }
});

// Export Events
fs.readdirSync('./listeners').forEach((file) => {
    if (file.endsWith('.js')) {
        try {
            const Listener = require('./listeners' + '/' + file)
            client.on(file.replace(/.js/g, ''), Listener)
        } catch(error) {
            console.error(`There was an error with the event ${file}\n`, error)
        }
    }
});

client.login(process.env.BOT_TOKEN);