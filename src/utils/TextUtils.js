const i18next = require('i18next')
const { Embed } = require('../')

class TextUtils {
  static parse (text = '', options = {}) {
    const { emoji, t, embed } = Object.assign({ emoji: null, t: null, embed: null, options: {} }, options)
    // add Emojis in #...
    if (emoji) {
      text = text.replace(/(?:#)\w+/g, (e) => emoji(e.slice(1).toUpperCase()))
    }
    // add text embed in @...
    if (embed && embed instanceof Embed) {
      text = text.replace(/(?:@)\w+/g, (k) => {
        const [key, v1, v2] = k.slice(1).split('.')
        const result = key && embed[key]
        const result1 = v1 && result && result[v1]
        const result2 = v2 && result1 && result1[v2]
        return result2 || result1 || result || k
      })
    }
    // add translaton in $"..."
    if (t) {
      text = text.replace(/(?:\$")(\S+)(?:")/g, (s) => this.t(t, s.slice(2, -1), options.options))
      return this.t(t, text, options.options)
    }
    return text
  }

  static t (t, key = '', options = {}) {
    if (!i18next.exists(key) || !t) return key
    else if (t) return t(key, options)
  }
}

module.exports = TextUtils
