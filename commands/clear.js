module.exports = {
    run: async function (message, client, [amount]) {
        
        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            message.reply('You require the **MANAGE_MESSAGES** permission in order to execute this command.')
            return;
        
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) 
            message.reply('I require the **MANAGE_MESSAGES** permission in order to execute this command.');
            return;
        
        let total = parseInt(amount, 10);
        if (!total || total < 2 || total > 100) 
            message.reply('Please, give a number between 2 and 100!');
            return;
    
        const res = await message.channel.fetchMessages({limit: total});
        message.channel.bulkDelete(res)
            .catch(err => {
                message.channel.send('There was an error while trying to delete the messages.');
                return;
            });
        message.channel.send(`${res.size} messages were deleted by ${message.author}.`)
            .then(m => m.delete(15000))
            .catch(err => console.log(err)) 
    },
    aliases: ["purge"]
};
