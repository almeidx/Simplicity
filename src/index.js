module.exports = {
  // Structures
  Bot: require('./structures/Bot'),
  Embed: require('./structures/Embed'),
  Command: require('./structures/Command'),
  Loggers: require('./structures/Loggers'),
  // Command
  CommandContext: require('./structures/command/CommandContext'),
  CommandError: require('./structures/command/CommandError'),
  // Utils
  Constants: require('./utils/Constants'),
  Utils: require('./utils/Utils'),
  LogUtils: require('./utils/LogUtils'),
  // Database
  Database: require('./database/Database.js')
}
