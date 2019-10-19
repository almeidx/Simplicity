/* eslint-disable no-console */
import { Message } from 'discord.js';

// @link https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
const reset = '\x1b[0m';
const bold = '\x1b[1m';
const fgBlack = '\x1b[30m';
function setColor(fgCode: number | number[], title: string = '', text: any = '') {
  let bgCode: number;
  if (typeof fgCode !== 'number') {
    const [a, b] = fgCode;
    fgCode = a;
    bgCode = b;
  } else {
    bgCode = fgCode + 10;
  }
  const foreground = `\x1b[${fgCode}m`;
  const background = `\x1b[${bgCode}m`;
  const timestamp = `${background}${fgBlack}${new Date().toLocaleString()}`;

  return `${timestamp + reset} ${foreground
    + bold
    + title
    + reset} ${foreground + text + reset}`;
}

export function error(message: string, text?: any) {
  return console.error(setColor(31, message, text));
}

export function log(title: string, text?: any) {
  return console.log(setColor(32, title, text));
}

export function warn(title: string, text?: any) {
  return console.warn(setColor(33, title, text));
}

export function info(title: string, text?: any) {
  return console.info(setColor([37, 47], title, text));
}

export function command(message: Message) {
  const { guild, author, cleanContent } = message;
  const msg = `${guild.name}(${guild.id}) @${author.tag}(${author.id})`;
  return console.info(setColor([36, 46], msg, cleanContent));
}
