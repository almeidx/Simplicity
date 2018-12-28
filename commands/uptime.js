const Discord = require("discord.js");
const moment = require("moment")
require("moment-duration-format")
module.exports = {
    run: async function(message, client, args) {

		let duration = moment.duration(client.uptime).format('D[d], H[h], m[m], s[s]');

   		message.channel.send(`Estou online à: **${duration}**`);
	},
	aliases: ["ut", "ontime"]
};