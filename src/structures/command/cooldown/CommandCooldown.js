'use strict';

const CooldownData = require('./CooldownData');

const CooldownTypes = {
  CONTINUE: 'continue',
  RATE_LIMIT: 'ratelimit',
};

class CommandCooldown extends Map {
  constructor(cooldown, ratelimitCooldown) {
    super();
    this.cooldown = cooldown;
    this.ratelimitCooldown = ratelimitCooldown || cooldown / 3;
  }

  handle(userID) {
    const user = this.get(userID);
    if (!user) return CooldownTypes.CONTINUE;

    const now = Date.now();
    const time = now - user.timestamp;
    if (CooldownData.isCooldown(this.cooldown, time)) {
      if (!user.isRateLimit()) {
        user.ratelimit += 1;
        return this.cooldown - time;
      } else {
        if (!user.ratelimitTimestamp) {
          user.ratelimitTimestamp = now;
        } else if (!user.isRateLimitCooldown(this.ratelimitCooldown, now)) {
          user.ratelimitTimestamp = null;
          user.ratelimit = 0;
        }
        return CooldownTypes.RATE_LIMIT;
      }
    } else {
      this.delete(userID);
      return CooldownTypes.CONTINUE;
    }
  }

  static getMessage(timestamp, t) {
    const date = new Date(timestamp);
    let time = '';

    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (minutes) time += t('common:minutes', { minutes });
    if (minutes && seconds) time += t('common:and');
    if (seconds) time += t('common:seconds', { seconds });

    const message = t('common:cooldown', { time: time || t('common:waitLittleTime') });
    return message;
  }

  add(userID) {
    return this.set(userID, new CooldownData());
  }
}

module.exports = { CommandCooldown, CooldownTypes };
