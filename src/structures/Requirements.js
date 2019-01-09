class Requirements {
  constructor (command) {
    this.command = command
    this.argsRequired = false
    this.clientPermissions = []
    this.memberPermissions = []
    this.responses = {}
    
  }
}

module.exports = Requirements
