/* eslint-disable consistent-return */
import {
  MessageAdditions, Message, ClientEvents,
} from 'discord.js';
import SimplicityClient from './SimplicityClient';
import Config from '../../config';
import Util from '../../util/Util';

/**
 * The main listener
 */
export default abstract class Listener {
  client: SimplicityClient
  event: keyof ClientEvents

  /**
   * @param event The event type
   * @param client The client for this listener
   */
  constructor(event: keyof ClientEvents, client: SimplicityClient) {
    this.event = event;
    this.client = client;
  }

  /**
   * What gets ran when the event is triggered
   */
  abstract exec (...args: any[]): any

  /**
   * Sends a private message using an ENV variable
   * @param envName The name of the env variable
   * @param content The content to send
   * @returns The message sent or false
   */
  sendPrivateMessage(
    configName: keyof typeof Config['CHANNELS'],
    content: MessageAdditions,
  ): void | Promise<Message | Message[]> {
    Util.sendPrivateMessage(this.client, configName, content);
  }
}
