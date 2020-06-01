'use strict';

const MAX_RATE_LIMIT = 3;

class CooldownData {
  constructor(timestamp = Date.now()) {
    this.timestamp = timestamp;
    this.ratelimit = 0;
    this.ratelimitTimestamp = null;
  }

  static isCooldown(cooldown, time) {
    return cooldown > time;
  }

  isRateLimitCooldown(ratelimitCooldown, now = Date.now()) {
    return this.ratelimitTimestamp && (now - this.ratelimitTimestamp) < ratelimitCooldown;
  }

  isRateLimit() {
    return this.ratelimit >= MAX_RATE_LIMIT;
  }
}

module.exports = CooldownData;
