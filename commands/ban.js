const Discord = require('discord.js');
module.exports = {
    run: async function (message, client, args) {
        
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            let embed = new Discord.MessageEmbed()
                .addField('Missing Permissions!', 'I require the **Ban Members** permission to execute this command.')
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({size: 2048}))
                .setTimestamp();            
            message.channel.send(embed);
            return;
        } else if (!message.member.permissions.has("BAN_MEMBERS")) {
            let embed = new Discord.MessageEmbed()
                .addField('Missing Permissions!', 'You need **Ban Members** permission to execute this command.')
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({size: 2048}))
                .setTimestamp();            
            message.channel.send(embed);
            return;
        };

        if (args.length == 0) {
            let embed = new Discord.MessageEmbed()
                .addField('Missing Parameters!', `Usage: **${process.env.PREFIX}ban [@mention/id] <reason>**`)
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({size: 2048}))
                .setTimestamp();            
            message.channel.send(embed);
            return;
        };

        let member = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!member) {
            let embed = new Discord.MessageEmbed()
                .addField('You didn\'t mention / used a valid ID!', `Usage: **${process.env.PREFIX}ban [@mention/id] <reason>**`)
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({size: 2048}))
                .setTimestamp();            
            message.channel.send(embed);
            return;
        };
        
        if (!message.member.roles.highest.position > member.roles.highest.position ) {
            let embed = new Discord.MessageEmbed()
                .addField('Denied!', `You can't manage this user because they have the same or higher role as you.`)
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({size: 2048}))
                .setTimestamp();            
            message.channel.send(embed);
            return;
        } else if (member.manageable) {

        }
    }
};