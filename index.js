require("dotenv").config();
const { Client, Collection } = require('discord.js');
const client = new Client();

const fs = require('fs');
client.commands = new Collection();

fs.readdirSync('./commands').forEach((file) => { 
    if (file.endsWith('.js')) {
        try {
            const command = require(`./commands/${file}`);
            client.commands.set(file.replace('.js', ''), command);
        } catch(error) {
            console.log(`deu erro arquivo ${file}\n`, error);
        }
    }
});

let path = './listeners';
  fs.readdirSync(path).forEach((file) => {
        if (file.endsWith('.js')) {
        try {
            const Listener = require(path + '/' + file)
            client.on(file.replace(/.js/g, ''), Listener)
        } catch (e) {
            console.error(`evento ${file} falhou`, e)
        }
    }
});

client.login(process.env.token);