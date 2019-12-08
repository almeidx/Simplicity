'use strict';

const { Schema, model } = require('mongoose');

const ModuleSchema = new Schema({
  enabled: Boolean,
  authorId: String,
  values: Schema.Types.Mixed,
}, {
  _id: false,
  timestamps: true,
});

const GuildSchema = new Schema({
  id: { required: true, type: String },
  lang: String,
  prefix: String,
  modules: { type: Map, to: ModuleSchema },
});

module.exports = model('guilds', GuildSchema);
