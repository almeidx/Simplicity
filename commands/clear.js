module.exports = {
    run: async function (message, client, [amount]) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.reply('Você não tem permissão para executar este comando!')
            return;
        };
        
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            message.reply('Eu não tenho permissões suficientes para executar esse comando!');
            return;
        };
        
        let total = parseInt(amount, 10);
        if (!total || total < 2 || total > 100) {
            message.reply('Por favor, indique entre 2 a 100 mensagens!');
            return;
        };
    
        const res = await message.channel.fetchMessages({limit: total});
        message.channel.bulkDelete(res).catch(err => {
            message.channel.send('There was an error while trying to delete the messages.');
            return;
        })
        message.channel.send(`Foram apagadas ${res.size} mensagens por ${message.author}. `).then(m => m.delete(15000)).catch(err => console.log(err)) 
    },
    aliases: ["purge"]
};
