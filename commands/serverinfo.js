const Discord = require('discord.js');
module.exports = {
    run: async function(message, client) {
        
        const moment = require('moment');
        moment.locale("PT-BR");

        let nome = message.guild.name;
        let id = message.guild.id;
        let online = message.guild.members.filter(a => a.presence.status == "online").size;
        let ocupado = message.guild.members.filter(a => a.presence.status == "dnd").size;
        let ausente = message.guild.members.filter(a => a.presence.status == "idle").size;
        let offline = message.guild.members.filter(a => a.presence.status == "offline").size;
        let clients = message.guild.members.filter(a => a.user.client).size;
        let totalmembros = message.guild.memberCount;
        let canaistexto = message.guild.channels.filter(a => a.type === "text").size;
        let canaisvoz = message.guild.channels.filter(a => a.type === "voice").size;
        let emojis = message.guild.emojis.array().length;
        let cargos = message.guild.roles.array().length;
        
        const embed = new Discord.RichEmbed()
            .addField('**Nome:**', nome, true)
            .addField('**Dono:**', `<@${message.guild.owner.id}>`, true)
            .addField('**ID:**', id, true)
            .addField('**Criado em**:', moment(message.guild.createdAt).format('LLLL'))
            .addField(`**Membros (${totalmembros + clients})**`, `**Online:** ${online}\n**Ausente:** ${ausente}\n**Ocupado:** ${ocupado}\n**Offline:** ${offline}\n**clients:** ${clients}`, true)
            .addField(`**Canais | Emojis | Cargos**`, `**Canais:** ${canaistexto + canaisvoz}\n**Emojis:** ${emojis}\n**Cargos:** ${cargos}`, true)
            .setThumbnail(message.guild.iconURL)
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL)
            .setColor("#36393F")
            .setTimestamp()
        message.channel.send(embed)
    }
};