module.exports = {
    run: async function(message, client) {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .addField('Como eu funciono?', `Simplicity é um client com focus em moderação, utilidade, musica, e muito mais!\nO meu prefixo é: ${process.env.prefix}!\nPara usar os meus comandos, digite **${process.env.prefix}help <modulo>**.`)
            .addField('Modulos Existentes:', 'Nenhum por agora ')
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL)
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL)
        message.channel.send(embed);
    }
}