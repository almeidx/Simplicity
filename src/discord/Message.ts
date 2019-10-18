import {
  Structures, StringResolvable, APIMessage, MessageOptions, MessageEditOptions,
} from 'discord.js';
import SimplicityClient from 'src/bot/client/SimplicityClient';

type contentType = StringResolvable | APIMessage
type optionsType = MessageEditOptions | MessageOptions

export default Structures.extend('Message', (DiscordMessage) => {
  class SimplicityMessage extends DiscordMessage {
    public readonly client: SimplicityClient

    async send(content: contentType, options: optionsType) {
      const msgId = this.client.commandMessages.get(this.id);
      const message = msgId && await this.channel.messages.fetch(msgId);
      if (message) {
        return message.edit(content, options);
      }
      return this.channel.send(content, options);
    }

    get botLanguages() {
      return this.client.languages;
    }
  }

  return SimplicityMessage;
});

declare module 'discord.js' {
  interface Message {
    client: SimplicityClient;
    send(content: contentType, options?: optionsType): Promise<Message | any>;
  }
}
