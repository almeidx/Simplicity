/* eslint-disable semi */
import { MessageTypes } from 'discord.js';
import { ParameterOptions } from '../base';

export default interface ArgumentBase {
  name: string;
  validate(msg: MessageTypes, options: ParameterOptions): boolean|string|Promise<boolean|string>;
  parse(msg: MessageTypes, options: ParameterOptions): Promise<any>|any;
};
