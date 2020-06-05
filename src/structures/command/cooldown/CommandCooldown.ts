import { TFunction } from 'i18next';
import CooldownData from './CooldownData';

export enum CooldownTypes {
  CONTINUE = 'continue',
  RATE_LIMIT = 'ratelimit',
};

export default class CommandCooldown extends Map {
  cooldown: number;
  ratelimitCooldown: number;

  constructor(cooldown: number, ratelimitCooldown = cooldown / 3) {
    super();
    this.cooldown = cooldown;
    this.ratelimitCooldown = ratelimitCooldown;
  }

  handle(userID: string): CooldownTypes | number {
    const user = this.get(userID);
    if (!user) return CooldownTypes.CONTINUE;

    const now = Date.now();
    const time = now - user.timestamp;
    if (CooldownData.isCooldown(this.cooldown, time)) {
      if (!user.isRateLimit()) {
        user.ratelimit += 1;
        return this.cooldown - time;
      }
      if (!user.ratelimitTimestamp) {
        user.ratelimitTimestamp = now;
      } else if (!user.isRateLimitCooldown(this.ratelimitCooldown, now)) {
        user.ratelimitTimestamp = null;
        user.ratelimit = 0;
      }
      return CooldownTypes.RATE_LIMIT;
    }
    this.delete(userID);
    return CooldownTypes.CONTINUE;
  }

  static getMessage(timestamp: number, t: TFunction): string {
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

  add(userID: string): this {
    return this.set(userID, new CooldownData());
  }
}
