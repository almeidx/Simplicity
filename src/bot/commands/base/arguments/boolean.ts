import { MessageTypes } from 'discord.js';
import { ParameterOptions } from '../base';
import ArgumentBase from './base';

export default class BooleanParameter implements ArgumentBase {
  name = 'boolean'

  private verifyContent(flag: string, content: string) {
    return new RegExp(`--${flag}`, 'gi').test(content);
  }

  validate(msg: MessageTypes, options: ParameterOptions) {
    if (options.flags.some((flag) => this.verifyContent(flag, msg.query))) return true;
    return false;
  }

  parse(msg: MessageTypes, options: ParameterOptions) {
    return this.validate(msg, options);
  }
}
