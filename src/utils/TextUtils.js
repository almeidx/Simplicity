const { Embed } = require('../')

class TextUtils {
  static parse (text = '', options = {}) {
    const { emoji, t, embed } = Object.assign({ emoji: null, t: null, embed: null, options: {} }, options)
    // add Emojis in #...
    if (emoji) {
      text = text.replace(/(?:#)\w+/g, (e) => emoji(e.slice(1).toUpperCase()))
    }
    // add translaton in $"..."
    if (t) {
      text = text.replace(/(?:\$")(\w+)(?:")/g, (s) => this.t(t, s.slice(2, -1), options.options))
    }
    // add text embed in @...
    if (embed instanceof Embed) {
      text = text.replace(/(?:@)\w+/g, (k) => {
        const [key, v1, v2] = k.slice(1).split('.')
        const result = key && embed[key]
        const result1 = v1 && result && result[v1]
        const result2 = v2 && result1 && result1[v2]
        return result2 || result1 || result || k
      })
    }

    return this.t(t, text, options.options)
  }

  static t (t, key, options = {}) {
    if (!t) throw Error('T invalid')
    const result = t(key, options)
    const spltKey = key.split(':')
    if (spltKey.length > 1 || spltKey.slice(1) === result) return key
    else return result
  }
}

module.exports = TextUtils
