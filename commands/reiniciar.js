const Discord = require('discord.js');
module.exports = {
    run: async function(message, client, args) {
    	
    	if (!process.env.developers.includes(message.author.id)) return message.channel.send('Você não tem permissão para usar esse comando!');

    	resetBot(message.channel)
        	async function resetBot(channel) {
            	channel.send(`Reiniciando...`)
            	.then(msg => client.destroy(true))
            	.then(() => client.login(process.env.token));
         	}

    	client.on('ready', () => {
        	message.channel.send(`Bot reiniciado com sucesso!`);
    	});
	}
};