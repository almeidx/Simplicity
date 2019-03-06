class Loader {
  constructor (client) {
    this.client = client
    this.required = false
  }

  load () {
    throw new Error(`${this.constructor.name} incomplete.`)
  }
}

module.exports = Loader
