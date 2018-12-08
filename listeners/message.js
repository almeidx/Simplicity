module.exports = function onMessage(message) {
    if (message.author.bot || message.type === "dm" || !message.content.startsWith(process.env.prefix)) 
        return;

    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
    const command = this.commands.get(args.shift().toLowerCase()); 
    
    if (command)
        command.run(message, this, args);
};