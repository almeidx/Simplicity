import { Message, TextChannel, PartialMessage } from 'discord.js';
import SimplicityClient from './SimplicityClient';

type MessageType = Message | PartialMessage
function validMessage({ author, channel, client }: MessageType) {
  return author.bot || (channel instanceof TextChannel && !channel.permissionsFor(client.user).has('SEND_MESSAGES'));
}

export default async function handleMessage(
  this: SimplicityClient, message: MessageType,
): Promise<void> {
  if (message.partial) message.fetch();
  if (validMessage(message)) return;

  if (this.databaseConnection) await message.guild.data.get();

  if (message.content.startsWith(message.guildPrefix)) {
    message.prefix = message.guildPrefix;

    const firstArg = message.args.shift();
    const x = firstArg && firstArg.toLowerCase().toString();
    const command = this.commands.find((cmd) => cmd.name === x || cmd.aliases.includes(x));

    if (command) command.exec(message);
  }
}
