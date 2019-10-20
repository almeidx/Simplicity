/* eslint-disable lines-between-class-members */
import { errorBases } from '../interface';

export class CommandBaseError extends Error {
    origin: errorBases;
    response: string;

    constructor(origin: errorBases, response: string) {
      super();
      this.origin = origin;
      this.response = response;
    }
}
