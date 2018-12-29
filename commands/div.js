const Discord = require('discord.js');
module.exports = {
    run: async function(message, client, args) {

        var user = message.mentions.users.first() || message.author;

        var targetInvites = await message.guild.fetchInvites();

        var invitesUses = 0;

        targetInvites.forEach(invite => {
            if (invite.inviter.id === user.id) {
                invitesUses += invite.uses;
            }
        });

        var embed = new Discord.MessageEmbed()
            .addField("Membros Recrutados:", `${invitesUses}`)
            .setColor("RANDOM")
            .setFooter(`${user.tag}`)
            .setTimestamp();
        message.channel.send(embed);
    }
};