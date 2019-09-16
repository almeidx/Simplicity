'use strict';
/* eslint-disable no-unused-vars */
function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}
/*
Estrutura
id
 - timestamp
 - ratelimit max = 3
*/
class CommandCooldown extends Map {
  isCooldown(userID, cooldown) {
    const user = this.get(userID);
    if (!user) return false;
    if (user.ratelimit >= 3) return 'cancel';
    user.ratelimit += 1;
    this.set(userID, user);
    const time = getTimeRemaining(user.timestamp);
    // eslint-disable-next-line no-empty
    if (time > cooldown) {}
  }
}
module.expoorts = CommandCooldown;
