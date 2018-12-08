module.exports = function onMessage(message) {
    if(message.author.bot || message.type === "dm" || message.content.startsWith(process.env.prefix)) 
    return;

    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
    const command = this.commands.get(args.shift().toLowerCase()); // vai da erro pq nao foi definido commands
    
    if (command)
        command.run(message, client, args);
};