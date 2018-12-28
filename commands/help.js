const Discord = require('discord.js');
module.exports = {
    run: async function(message, client, args) {
        
        
        let embed = new Discord.RichEmbed()
            .setTimestamp()
            .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL)

        if (args.length == 0) {
            embed.addField('Como eu funciono?', `Simplicity é um client com focus em moderação, utilidade, musica, e muito mais!\nO meu prefixo é: ${process.env.PREFIX}!\nPara usar os meus comandos, digite **${process.env.PREFIX}help <modulo>**.`)
            embed.addField('Modulos Existentes:', 'Nenhum por agora ')
            embed.setThumbnail(client.user.displayAvatarURL)
        } else if (args[0].toLowerCase() == ('bot' || 'simplicity')) {
            embed.addField('Bot Stuff', '\`[]\` = Required Parameters.\n\`<>\` = Optional Parameters.')
            embed.addField('')
        }
        message.channel.send(embed);
    },
    aliases: ["h"]
};