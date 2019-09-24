'use strict';

class RunStore extends Map {
  constructor(command) {
    super();
    this.command = command;
  }

  add(channelID, userID, timeout = 120000) {
    const data = this.get(userID);
    if (data && data.has(channelID)) return null;
    else {
      const channels = data || new Set();
      channels.add(channelID);
      this.set(userID, channels);
      if (timeout) setTimeout(() => this.remove(channelID, userID), timeout);
    }
  }

  remove(channelID, userID) {
    const data = this.get(userID);
    if (this.has(channelID, userID)) data.delete(channelID);
    if (!data || (data.size === 0)) this.delete(userID);
  }

  has(channelID, userID) {
    const data = this.get(userID);
    return data && data.has(channelID);
  }
}

module.exports = RunStore;
