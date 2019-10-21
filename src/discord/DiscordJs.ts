import { Message, PartialMessage } from 'discord.js';

declare module 'discord.js' {
    type MessageTypes = Message | PartialMessage
}
