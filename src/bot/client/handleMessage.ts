import { Message, TextChannel, PartialMessage } from 'discord.js';
import SimplicityClient from './SimplicityClient';

type MessageType = Message | PartialMessage
function validMessage({ author, channel, client }: MessageType) {
  return author.bot || (channel instanceof TextChannel && !channel.permissionsFor(client.user).has('SEND_MESSAGES'));
}

export default async function handleMessage<SimplicityClient>(message: MessageType): Promise<void> {
  if (validMessage(message)) return;
  if (message.content.startsWith('!test')) {
    const { id } = await message.send('kk');
    this.commandMessages.set(message.id, id);
  }
}
