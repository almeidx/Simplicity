const Discord = require('discord.js');
const Util = require('util');
module.exports = {
    run: async function(message, client, args) {

        if (!process.env.developers.includes(message.author.id)) return message.channel.send('Você não tem permissão para usar esse comando!');

        if (args.length == 0) return message.channel.send('Você esqueceu de colocar o código!');

        let code = args.join(' ').replace(/^```(js|javascript ?\n)?|```$/g, '')
        let value = (l, c) => `\`\`\`${l}\n${String(c).slice(0, 1000) + (c.length >= 1000 ? '...' : '')}\n\`\`\``
        let embed = new Discord.RichEmbed()
            .setColor('#36393F')
        
        try {
            let resultEval = eval(code)
            let toEval = typeof resultEval === 'string' ? resultEval : Util.inspect(resultEval,  { depth: 1 })  

            embed.addField('Resultado', value('js', toEval))
            embed.addField('Tipo', value('css', typeof resultEval))
        } catch (error) {
            embed.addField('Error', value('js', error))
        } finally {
            message.channel.send(embed)
        }
    },
    aliases: ["compile"]
};