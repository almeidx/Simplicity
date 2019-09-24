'use strict';

class CommandError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.options = options;
    this.onUsage = !!options.onUsage;
    this.fields = [];
  }

  addField(name, value, inline = false, options = {}, valueOptions = {}) {
    this.fields.push({ name, value, inline, options, valueOptions });
    return this;
  }
}

module.exports = CommandError;
