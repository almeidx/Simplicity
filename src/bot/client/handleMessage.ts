import { Message, TextChannel, PartialMessage } from 'discord.js';
import SimplicityClient from './SimplicityClient';

type MessageType = Message | PartialMessage
function validMessage({ author, channel, client }: MessageType) {
  return author.bot || (channel instanceof TextChannel && !channel.permissionsFor(client.user).has('SEND_MESSAGES'));
}

export default async function handleMessage(
  this: SimplicityClient, message: MessageType,
): Promise<void> {
  if (validMessage(message)) return;

  if (message.partial) {
    await message.fetch();
  }

  if (this.databaseConnection) await message.guild.data.get();

  if (message.content.startsWith(message.guildPrefix)) {
    message.prefix = message.guildPrefix;
    message.args = message.content.slice(message.prefix.length).split(' ');

    const firstArg = message.args.join(' ');
    const x = firstArg && firstArg.toLowerCase().toString();
    const command = this.commands.find((cmd) => cmd.name === x || cmd.aliases.includes(x));

    if (command) {
      message.command = command;
      command.exec(message);
    }
  }
}
