import { MessageTypes, TextChannel } from 'discord.js';
import i18next from 'i18next';
import SimplicityClient from './SimplicityClient';


function validMessage({ author, channel, client }: MessageTypes) {
  return author.bot || (channel instanceof TextChannel && !channel.permissionsFor(client.user).has('SEND_MESSAGES'));
}

export default async function handleMessage(
  this: SimplicityClient, message: MessageTypes,
): Promise<void> {
  if (validMessage(message)) return;

  if (message.partial) {
    await message.fetch();
  }

  if (this.databaseConnection) await message.guild.data.get();

  if (message.content.startsWith(message.guildPrefix)) {
    message.prefix = message.guildPrefix;
    message.args = message.content.slice(message.prefix.length).split(' ');
    message._ = i18next.getFixedT(message.language);

    const firstArg = message.args.shift();
    const x = firstArg && firstArg.toLowerCase().toString();
    const command = this.commands.find((cmd) => cmd.name === x || cmd.aliases.includes(x));

    if (command) {
      message.command = command;
      command.exec(message);
    }
  }
}
