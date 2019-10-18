
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


function timestamp() {
  return setColor('FgMagenta', moment().format('DD/MM/YYYY HH:mm:ss'));
}

function _log(color, type = 'log', text) {
  return console[type](`${timestamp} ${setColor(color, text)}`);
}

function log(text) {
  return _log('FgGreen', 'log', text);
}

function error(text) {
  return _log('FgRed', 'error', text);
}

function warn(text) {
  return _log('FgYellow', 'warn', text);
}

function logCommand({
  guild, channel, author, content,
}) {
  const warn = setColor('FgYellow', '[Command]');
  const g = setColor('FgBlue', guild);
  const c = setColor('FgCyan', `#${channel}`);
  const u = setColor('FgGreen', `@${author}`);
  return console.warn(`${_timestamp} ${warn} ${g} ${c} ${u} ${content}`);
}
