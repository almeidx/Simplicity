const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    run: async function(message, client) {
        let online = message.guild.members.filter(user => user.presence.status == 'online').size;
        let idle = message.guild.members.filter(user => user.presence.status == 'idle').size;
        let dnd = message.guild.members.filter(user => user.presence.status == 'dnd').size;
        let offline = message.guild.members.filter(user => user.presence.status == 'offline').size;
        let bots = message.guild.members.filter(user => user.user.client).size;
        let members = message.guild.memberCount;
        let text = message.guild.channels.filter(ch => ch.type === 'text').size;
        let voice = message.guild.channels.filter(ch => ch.type === 'voice').size;
        let emojis = message.guild.emojis.size;
        let roles = message.guild.roles.size;
        let verificationLevel;
        let verificationName;
        if (message.guild.verificationLevel == 0) {
            verificationName = 'None'; 
            verificationLevel = 'Unrestricted.';
        } else if (message.guild.verificationLevel == 1) {
            verificationName = 'Low'; 
            verificationLevel = 'Must have a verified email on their Discord account.';
        } else if (message.guild.verificationLevel == 2) {
            verificationName = 'Medium'; 
            verificationLevel = 'Must be registered on Discord for longer than 5 minutes.';
        } else if (message.guild.verificationLevel == 3) {
            verificationName = '(╯°□°）╯︵ ┻━┻';
            verificationLevel = 'Must be a member of the server for longer than 10 minutes.';
        } else if (message.guild.verificationLevel == 4) {
            verificationName = '';
            verificationLevel = 'Must have a verified phone on their Discord account.';
        };
        let embed = new Discord.MessageEmbed()
            .addField('» Name:', message.guild.name, true)
            .addField('» Owner:', `<@${message.guild.owner.id}>`, true)
            .addField('» ID:', message.guild.id, true)
            .addField('» Created:', moment(message.guild.createdAt).format('LLLL'))
            .addField(`» Members (${members + bots})`, `**Online:** ${online}\n**Idle:** ${idle}\n**Do Not Disturb:** ${dnd}\n**Offline:** ${offline}\n**Bots:** ${bots}`, true)
            .addField(`» Channels | Emojis | Roles`, `${text + voice} | ${emojis} | ${roles}`, true)
            .addField(`» Verification Level: ${verificationName}`, verificationLevel)
            .setThumbnail(message.guild.iconURL({size: 2048}))
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({size: 2048}))
            .setColor("#36393F")
            .setTimestamp();
        message.channel.send(embed);
    },
    aliases: ["si", "server"]
};