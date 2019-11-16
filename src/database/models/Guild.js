'use strict';

const { Schema, model } = require('mongoose');

const GuildSchema = new Schema({
  id: { required: true, type: String },
  lang: String,
  prefix: String,
});


module.exports = model('guilds', GuildSchema);
