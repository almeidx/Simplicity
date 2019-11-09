'use strict';

module.exports = {
  Command: require('./command/Command'),
  CommandError: require('./command/CommandError'),
  Loader: require('./Loader'),
  Parameters: require('../parameters'),
  SimplicityClient: require('./discord/SimplicityClient'),
  SimplicityEmbed: require('./discord/SimplicityEmbed'),
  SimplicityListener: require('./discord/SimplicityListener'),
};
