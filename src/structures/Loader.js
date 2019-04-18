class Loader {
  constructor (client) {
    this.client = client
    this.required = false
  }

  load () {
    throw new Error(`${this.constructor.name} is incomplete.`)
  }
}

module.exports = Loader
