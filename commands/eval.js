const Discord = require('discord.js');
module.exports = {
    run: async function(message, client, args) {
              
        var dev = ["289209067963154433", "281561868844269569", "385132696135008259"]
    
        if(!dev.includes(message.author.id)) {
            var embedd = new Discord.RichEmbed()
                .addField('Você não tem permissão para usar este comando!', 'Você tem que ser um Desenvolvedor para poder usar este comando!')
                .setTimestamp()
                .setColor("#ff3939")
                .setFooter(`Executado por ${message.author.tag}`, message.author.displayAvatarURL)
            message.channel.send(embedd);
            return;
        };
    
        if (message.content.toLowerCase().includes('token')) {
            var embedt = new Discord.RichEmbed()
                .setTitle('Negado! \⛔')
                .setTimestamp()
                .setColor("#ff3939")
                .setFooter(`Executado por ${message.author.tag}`, message.author.displayAvatarURL)
            message.channel.send(embedt);
            return;
        };
            
        if(args.length === 0) {
            var embeda = new Discord.RichEmbed()
                .setTitle('Você precisa de inserir o código!')
                .setTimestamp()
                .setColor("#ff3939")
                .setFooter(`Executado por ${message.author.tag}`, message.author.displayAvatarURL)
            message.channel.send(embeda);
                return;
        };

        var embed = new Discord.RichEmbed()
        try {
            let evaled = eval(args.join(' '));
            let evaledMsg = `${evaled}`.replace(process.env.token, '*'.repeat(process.env.token.length)).slice(0, 950);
            embed.setColor("#07ed66")
            .addField('Resultado:', `\`\`\`js\n${evaledMsg}\`\`\``); 
        } catch (err) {
            embed.setColor("#e53030")
            .addField('Erro:', `\`\`\`js\n${err}\`\`\``);
        } finally {
            await message.channel.send(embed);
        };
    }
};