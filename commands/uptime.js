const Discord = require("discord.js");
const moment = require("moment")
require("moment-duration-format")
module.exports = {
    run: async function(message, client, args) {
		let duration = moment.duration(client.uptime).format('D[d], H[h], m[m], s[s]');
		message.channel.send(`I have been online for: **${duration}**`);
	},
	aliases: ["ut", "ontime"]
};