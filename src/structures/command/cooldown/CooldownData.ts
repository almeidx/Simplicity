export const COOLDOWN_MAX_RATE_LIMIT = 3;

export default class CooldownData {
  ratelimit: number;
  timestamp: number;
  rateLimitTimestamp?: number;

  /**
   * @param timestamp The timestamp for this cooldown
   */
  constructor(timestamp = Date.now()) {
    this.timestamp = timestamp;
    this.ratelimit = 0;
  }

  static isCooldown(cooldown: number, time: number): boolean {
    return cooldown > time;
  }

  isRateLimitCooldown(ratelimitCooldown: number, now = Date.now()): boolean {
    return this.rateLimitTimestamp ? (now - this.rateLimitTimestamp) < ratelimitCooldown : false;
  }

  isRateLimit(): boolean {
    return this.ratelimit >= COOLDOWN_MAX_RATE_LIMIT;
  }
}
