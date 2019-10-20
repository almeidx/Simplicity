import { Message, TextChannel, PartialMessage } from 'discord.js';
import SimplicityClient from './SimplicityClient';

type MessageType = Message | PartialMessage
function validMessage({ author, channel, client }: MessageType) {
  return author.bot || (channel instanceof TextChannel && !channel.permissionsFor(client.user).has('SEND_MESSAGES'));
}

export default async function handleMessage<SimplicityClient>(message: MessageType): Promise<void> {
  if (validMessage(message)) return;

  await message.guild.data.get();

  if (message.content.startsWith(message.guildPrefix)) {
    message.prefix = message.guildPrefix;

    let responseId;
    if (message.commandName === 'test') {
      responseId = await message.send('kk');
    }

    if (message.commandName === 'setprefix') {
      const [p] = message.args;
      if (!p) {
        responseId = await message.send('digite um prefix');
      } else {
        await message.guild.data.update({ prefix: p });
        responseId = await message.send(`prefix definido como: ${p}`);
      }
    }
  }
}
