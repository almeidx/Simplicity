'use strict';

const { Command, CommandError } = require('@structures');
const { RegexEmojis } = require('@util');
const { MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

const ANIMATED_EMOJI_REGEX = /^<a:/;

class Emoji extends Command {
  constructor(client) {
    super(client, 'emoji', {
      aliases: ['emote', 'jumbo'],
      category: 'util',
    });
  }

  async run({ args, send }) {
    if (!args[0]) {
      throw new CommandError('commands:emoji.noArgs');
    }

    let result, type = 'png';

    const clean = args[0].codePointAt().toString(16);
    const defaultEmoji = clean && clean.split(RegexEmojis)[0];
    const defaultUrl = defaultEmoji && `https://twemoji.maxcdn.com/2/72x72/${defaultEmoji}.png`;
    const emoji = defaultEmoji && await fetch(defaultUrl).then((r) => r.status !== 404).catch(() => null);

    if (emoji) result = defaultUrl;
    if (!emoji && ANIMATED_EMOJI_REGEX.test(args[0])) type = 'gif';

    const id = !emoji && args[0].split(':').pop().replace('>', '');
    const customUrl = id && `https://cdn.discordapp.com/emojis/${id}.${type}?v=1`;
    const resultFetchURL = customUrl && await fetch(customUrl).then((r) => r.status !== 404).catch(() => null);

    if (resultFetchURL) result = customUrl;
    const attachment = result && new MessageAttachment(result, `emoji.${type}`);
    if (!result || !attachment) throw new CommandError('commands:emoji.error');

    return send(attachment);
  }
}

module.exports = Emoji;
