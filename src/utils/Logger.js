'use strict';

const moment = require('moment');
moment.locale('pt-br');

const colors = {
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
};

const reset = '\x1b[0m';
const setColor = (c, text) => `${colors[c] + text + reset}`;

class Logger {
  static get _timestamp() {
    return setColor('FgMagenta', moment().format('DD/MM/YYYY HH:mm:ss'));
  }

  static _log(color, type = 'log', text) {
    return console[type](`${Logger._timestamp} ${setColor(color, text)}`);
  }

  static log(text) {
    return Logger._log('FgGreen', 'log', text);
  }

  static error(text) {
    return Logger._log('FgRed', 'error', text);
  }

  static warn(text) {
    return Logger._log('FgYellow', 'warn', text);
  }

  static logCommand({ guild, channel, author, content }) {
    const warn = setColor('FgYellow', '[Command]');
    const g = setColor('FgBlue', guild);
    const c = setColor('FgCyan', `#${channel}`);
    const u = setColor('FgWhite', `@${author}`);
    const m = setColor('FgYellow', content);
    return console.warn(`${Logger._timestamp} ${warn} ${g} ${c} ${u} ${m}`);
  }
}

module.exports = Logger;
