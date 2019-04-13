const moment = require('moment')
require('moment-duration-format')

class Utils {
  static convertDateLang (t, time) {
    return moment.duration(time).format(`D[ ${t('common:date.days')}], H[ ${t('common:date.hours')}], m[ ${t('common:date.minutes')}], s[ ${t('common:date.seconds')}]`)
  }

  static getImageHex (hex) {
    return `http://www.colourlovers.com/img/${hex}/200/200/Sminted.png`
  }

  static getServerIconURL (guild) {
    if (guild.iconURL()) return guild.iconURL({ format: 'png', size: 2048 })
    else return `https://guild-default-icon.herokuapp.com/${guild.nameAcronym}`
  }

  static getJoinPosition (ID, guild) {
    if (!guild.member(ID)) return

    const array = guild.members.array()
    array.sort((a, b) => a.joinedAt - b.joinedAt)

    const result = array.map((m, i) => { return { index: i, id: m.user.id } }).find(m => m.id === ID)
    return (result && result.index) || null
  }
}

module.exports = Utils
