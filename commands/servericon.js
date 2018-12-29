const Discord = require('discord.js');
module.exports = {
    run: async function(message, client) {
        let embed = new Discord.MessageEmbed()
            .setDescription(`Click [here](${message.guild.iconURL}) to download the icon!`)
            .setImage(message.guild.iconURL({size: 2048}))
            .setColor("#36393F")
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL);
        message.channel.send(embed);
    },
    aliases: ["svicon"]
};