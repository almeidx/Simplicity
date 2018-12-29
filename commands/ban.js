const Discord = require('discord.js');
module.exports = {
    run: async function (message, client, args) {
        
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            let embed = new Discord.MessageEmbed()
            
            message.reply(`I require the **Ban Members** permission in order to execute this command!`);
            return;
        }

        if (!message.author.permissions.has("BAN_MEMBERS")) {
            message.reply('You require the **Ban Members** permission in order to execute this command!')
            return;
        }

        // lazy to continue this 
        
    }
};