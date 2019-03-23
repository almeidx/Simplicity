module.exports = {
  // Structures
  Bot: require('./structures/Bot'),
  Embed: require('./structures/Embed'),
  Loggers: require('./structures/Loggers'),
  Loader: require('./structures/Loader'),
  Parameter: require('./structures/Parameter'),
  // Command
  Command: require('./structures/command/Command'),
  CommandContext: require('./structures/command/CommandContext'),
  CommandError: require('./structures/command/CommandError'),
  // Utils
  Constants: require('./utils/Constants'),
  Utils: require('./utils/Utils'),
  LogUtils: require('./utils/LogUtils'),
  FileUtils: require('./utils/FileUtils'),
  // Database
  Database: require('./database/Database.js'),
  // Parameters
  Parameters: require('./parameters')
}
