const Discord = require('discord.js');
module.exports = {
    run: async function(message, client, args) {
	
	if (!process.env.DEVS.includes(message.author.id)) return message.channel.send('Você não tem permissão para usar este comando!');

  	if (args.length == 0) return message.reply(`Você não indentificou o nome do comando.`);
  		try {
      		delete require.cache[require.resolve(`./${args}.js`)];
  		} catch (e) {
      		return message.channel.send(`O comando **${args[0]}** não foi encontrado!`);
  		}
  		
  	message.channel.send(`O comando **${args}** foi reiniciado com sucesso!`);
	}
};