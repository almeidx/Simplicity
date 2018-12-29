const Discord = require('discord.js');
module.exports = {
    run: async function(message, client, args) {
    	if (!process.env.DEVS.includes(message.author.id)) {
			message.reply('You must be a developer in order to execute this command!');
			return;
		};

    	resetBot(message.channel) 
        	async function resetBot(channel) {
            	channel.send(`Reiniciando...`)
            		.then(msg => client.destroy(true))
            		.then(() => client.login(process.env.TOKEN));
         	}

    	client.on('ready', () => {
        	message.channel.send(`Bot reiniciado com sucesso!`);
    	});
	}
};