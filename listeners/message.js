module.exports = function onMessage(message) {
    if (message.author.bot || message.type === "dm") return;
    if (message.content.includes(`${this.user.id}`)) return message.channel.send(`<a:sockPONGGGG:513111387871117323>`);
    if (!message.content.startsWith(process.env.PREFIX)) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase()
    const command = this.commands.find((c, i) => i === commandName || (Array.isArray(c.aliases) && c.aliases.includes(commandName)));
    
    if (command) {
        command.run(message, this, args);
    }
};