const Discord = require('discord.js');
module.exports = {
    run: async function(message, client) {
        
        let embed = new Discord.RichEmbed()
            .setDescription(`Clique [aqui](${message.guild.iconURL}) para fazer download!`)
            .setImage(`${message.guild.iconURL}?size=2048`)
            .setColor("#36393F")
            .setFooter(`Executado por : ${message.author.tag}`, message.author.displayAvatarURL)
        message.channel.send(embed);
    }
};