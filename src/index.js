module.exports = {
  // Structures
  SimplicityClient: require('./structures/SimplicityClient'),
  Embed: require('./structures/Embed'),
  Loggers: require('./structures/Loggers'),
  Loader: require('./structures/Loader'),
  Listener: require('./structures/Listener'),
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
  TextUtils: require('./utils/TextUtils'),
  PermissionsUtils: require('./utils/PermissionsUtils'),
  // Database
  Database: require('./database/Database'),
  // Parameters
  Parameters: require('./parameters')
}
