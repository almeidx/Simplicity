const moment = require('moment')
require('moment-duration-format')

module.exports = class Utils {
  static convertDateLang (t, time) {
    return moment.duration(time).format(`D[ ${t('utils:date.days')}], H[ ${t('utils:date.hours')}], m[ ${t('utils:date.minutes')}], s[ ${t('utils:date.seconds')}]`)
  }
}
