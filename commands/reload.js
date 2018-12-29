const Discord = require('discord.js');
module.exports = {
    run: async function(message, client, args) {
		if (!process.env.DEVS.includes(message.author.id)) {
			message.reply('You must be a developer in order to execute this command!');
			return;
		};

		if (args.length == 0) {
			message.reply('You didn\'t provide a command name.');
			return;
		};

  		try {
      		delete require.cache[require.resolve(`./${args}.js`)];
  		} catch (e) {
			message.reply(`I could\'nt find any command with the name **${args[0]}**!`);
			return;  
  		};
  		message.reply(`The command **${args}** has been reloaded sucessfully!`);
	},
	aliases: ["rl"]
};